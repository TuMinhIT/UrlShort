using UrlShortener.Domain.Entities;

namespace UrlShortener.Application.Interfaces
{
    public interface IUrlRepository
    {
        Task<ShortUrl?> GetByCodeAsync(string code);
        Task AddAsync(ShortUrl url);
        Task UpdateAsync(ShortUrl url);
        Task IncrementClickCountAsync(string code, int increment);
        Task<List<ShortUrl>> GetByIpAsync(string ip);
    }
}
