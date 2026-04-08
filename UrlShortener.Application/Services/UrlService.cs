using System;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using UrlShortener.Application.Interfaces;
using UrlShortener.Application.IRepositories;
using UrlShortener.Domain.Entities;
using System.Security.Cryptography;

namespace UrlShortener.Application.Services
{

    public class UrlService 
    {
        private readonly IUrlRepository _urlRepository;
        private readonly ICacheRepository _cacheRepository;

        public UrlService(IUrlRepository urlRepository, ICacheRepository cache)
        {
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

            return new string(result);
        }
    public async Task<string?> GetOriginalUrlAsync(string code)
            {
            var cacheKey = $"url:{code}";

            // 1. Check Redis trước
            var cachedUrl = await _cacheRepository.GetAsync(cacheKey);
            if (!string.IsNullOrEmpty(cachedUrl))
            {
                return cachedUrl;
            }

            // 2. Nếu không có thì query DB
            var urlEntity = await _urlRepository.GetByCodeAsync(code);

            if (urlEntity == null)
                return null;

            // 3. Lưu lại vào Redis (cache)
            await _cacheRepository.SetAsync(cacheKey, urlEntity.OriginalUrl, TimeSpan.FromHours(1));

            return urlEntity.OriginalUrl;
        }
    }
    
}

