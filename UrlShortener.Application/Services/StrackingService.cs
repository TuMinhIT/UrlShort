
using StackExchange.Redis;

namespace UrlShortener.Application.Services
{
    public class StrackingService
    {
        private readonly IConnectionMultiplexer _redis;

        public StrackingService(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        public async Task PushClickEventAsync(string shortCode, string ip)  
        {
            // Lấy ra IDatabase từ Connection Multiplexer
            var db = _redis.GetDatabase();

            var entries = new NameValueEntry[]
            {
                new NameValueEntry("code", shortCode),
                new NameValueEntry("ip", ip ?? "unknown"),
                new NameValueEntry("time", DateTime.UtcNow.ToString("o"))
            };

            // Gọi hàm StreamAddAsync trên IDatabase
            await db.StreamAddAsync("stream:clicks", entries);
        }
    }
}
