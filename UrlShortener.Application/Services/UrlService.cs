using UrlShortener.Application.Interfaces;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Application.Services
{

    public class UrlService 
    {
        private readonly IUrlRepository _urlRepository;

        // Tiêm IUrlRepository để tương tác với Database
        public UrlService(IUrlRepository urlRepository)
        {
            _urlRepository = urlRepository;
        }

        public async Task<string> CreateShortCodeAsync(string originalUrl)
        {
            // Kiểm tra tính hợp lệ cơ bản của logic nghiệp vụ
            if (string.IsNullOrWhiteSpace(originalUrl) || !Uri.TryCreate(originalUrl, UriKind.Absolute, out _))
            {
                throw new ArgumentException("URL không hợp lệ.");
            }

            // Logic tạo chuỗi ShortCode ngẫu nhiên
            var shortCode = Guid.NewGuid().ToString().Substring(0, 6);

            var newUrl = new ShortUrl
            {
                OriginalUrl = originalUrl,
                ShortCode = shortCode,
                CreatedAt = DateTime.UtcNow
            };

            // Lưu vào DB thông qua Repository
            await _urlRepository.AddAsync(newUrl);

            return shortCode;
        }

        public async Task<string?> GetOriginalUrlAsync(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return null;

            var urlEntity = await _urlRepository.GetByCodeAsync(code);
            return urlEntity?.OriginalUrl;
        }
    }
}
