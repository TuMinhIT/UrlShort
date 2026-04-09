using StackExchange.Redis;
using UrlShortener.Application.IRepositories;

namespace UrlShortener.Infrastructure.Repositories
{

    public class CacheRepository : ICacheRepository 
    {
        private readonly IDatabase _db;

        public CacheRepository(IConnectionMultiplexer redis)
        {
            _db = redis.GetDatabase();
        }

        public async Task<string?> GetAsync(string key)
        {
            return await _db.StringGetAsync(key);
        }

        public async Task<long?> GetCountAsync(string key)
        {
            var value = await _db.StringGetAsync(key);
            if (value.IsNullOrEmpty)
                return null;
            return (long)value;
        }

        public async Task SetAsync(string key, string value, TimeSpan? expiry = null)
        {
            await _db.StringSetAsync(key, value);
        }

        public async Task SetCountAsync(string key, long value)
        {
            await _db.StringSetAsync(key, value);
        }
    }
}
