
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StackExchange.Redis;
using UrlShortener.Application.Interfaces;

namespace UrlShortener.Application.Services
{
    public class ClickStreamConsumer : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public ClickStreamConsumer(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var redis = scope.ServiceProvider.GetRequiredService<IConnectionMultiplexer>();
            var db = redis.GetDatabase();

            string streamKey = "stream:clicks";
            string groupName = "click-group";
            string consumerName = "consumer-1";

            // tạo group nếu chưa có
            try
            {
                await db.StreamCreateConsumerGroupAsync(streamKey, groupName, "$");
            }
            catch { }

            while (!stoppingToken.IsCancellationRequested)
            {
                var messages = await db.StreamReadGroupAsync(
                    streamKey,
                    groupName,
                    consumerName,
                    count: 10
                );

                if (messages.Length == 0)
                {
                    await Task.Delay(2000);
                    continue;
                }

                foreach (var msg in messages)
                {
                    var code = msg["code"];
                    var ip = msg["ip"];

                    //  xử lý: update DB
                    using var innerScope = _scopeFactory.CreateScope();
                    var repo = innerScope.ServiceProvider.GetRequiredService<IUrlRepository>();

                    await repo.IncrementClickCountAsync(code, 1);

                    // ack message
                    await db.StreamAcknowledgeAsync(streamKey, groupName, msg.Id);
                }
            }
        }
    }
}
