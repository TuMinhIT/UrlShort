
using System.Security.Cryptography;
using System.Text;
using UrlShortener.Application.Interfaces;
using UrlShortener.Application.IRepositories;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Application.Services
{

    public class UrlService
    {
        private readonly IUrlRepository _urlRepository;
        private readonly ICacheRepository _cacheRepository;
        private readonly StrackingService _trackingService;
        public UrlService(IUrlRepository urlRepository, ICacheRepository cache, StrackingService strackingService)
        {
            _trackingService = strackingService;
            _urlRepository = urlRepository;
            _cacheRepository = cache;
        }

        public async Task<string> CreateShortCodeAsync(string originalUrl, string ip)
        {
            // Kiểm tra tính hợp lệ cơ bản của url
            if (string.IsNullOrWhiteSpace(originalUrl) || !Uri.TryCreate(originalUrl, UriKind.Absolute, out _))
            {
                throw new ArgumentException("URL không hợp lệ.");
            }

            //  1. Tạo record trước
            var newUrl = new ShortUrl
            {
                ShortCode = "temp", // tạm thời để trống, sẽ update sau
                OriginalUrl = originalUrl,
                CreatedAt = DateTime.UtcNow,
                Ip = ip,
                CountClick = 0
            };

            await _urlRepository.AddAsync(newUrl);

            //  2. Encode ID thành shortCode
            var shortCode = GenerateRandomCode(newUrl.Id);

            //  3. Update lại
            newUrl.ShortCode = shortCode;
            await _urlRepository.UpdateAsync(newUrl);

            return shortCode;
        }

        private const string Chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        public string GenerateRandomCode(long id)
        {
            int length = 8;
            var result = new char[length];
            var bytes = new byte[length];

            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(bytes);
            }

            for (int i = 0; i < length; i++)
            {
                result[i] = Chars[bytes[i] % Chars.Length];
            }

            return new string(result) + id.ToString();
        }

        //  Click → Push event vào Stream (queue)
        //→ Worker đọc queue
        //→ Update DB
        public async Task<string?> GetOriginalUrlAsync(string code, string ip)
        {
            var cacheKey = $"url:{code}";
            string? originalUrl = null;

            // 1. Check Redis trước
            var cachedUrl = await _cacheRepository.GetAsync(cacheKey);
            if (!string.IsNullOrEmpty(cachedUrl))
            {
                originalUrl = cachedUrl;
            }
            else
            {
                // 2. Nếu không có thì query DB
                var urlEntity = await _urlRepository.GetByCodeAsync(code);

                if (urlEntity != null)
                {
                    originalUrl = urlEntity.OriginalUrl;
                    // 3. Lưu lại vào cache để lần sau đọc nhanh hơn + Set thêm bộ đếm vào Cache
                    await _cacheRepository.SetAsync(cacheKey, originalUrl, TimeSpan.FromHours(1));

                    // Thiết lập giá trị Count ban đầu cho Redis nếu chưa có
                    await _cacheRepository.SetCountAsync($"click:{code}", urlEntity.CountClick);
                }
            }

            // 4. Báo null nếu ko tìm thấy ở đâu
            if (originalUrl == null)
            {
                return null;
            }

            // 5. Tracking: 
            // - Tăng trực tiếp cache đếm lượt click 
            await _cacheRepository.SetCountAsync($"click:{code}", (await GetClickCountAsync(code)) + 1);

            // - Đẩy log xuống Redis Stream cho Background Service update vào SQL Async
            // Việc đẩy là rất nhẹ nhàng
            await _trackingService.PushClickEventAsync(code, ip);

            return originalUrl;
        }

      
        public async Task<List<ShortUrl>> GetByIpAsync(string ip)
        {
            var urls = await _urlRepository.GetByIpAsync(ip);
            return urls;
        }

        public async Task<long> GetClickCountAsync(string code)
        {
            var value = await _cacheRepository.GetCountAsync($"click:{code}");

            return (long)value;
        }


    }

}



