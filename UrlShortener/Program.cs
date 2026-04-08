
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using System.Threading.RateLimiting;
using UrlShortener.Application.Interfaces;
using UrlShortener.Application.IRepositories;
using UrlShortener.Application.Services;
using UrlShortener.Infrastructure.Data;
using UrlShortener.Infrastructure.Repositories;


namespace UrlShortener
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddAuthorization();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Cấu hình Controllers
            builder.Services.AddControllers();

            //  Thêm HTTP Logging để log mọi request/response
            builder.Services.AddHttpLogging(logging =>
            {
                logging.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.All;
                logging.ResponseHeaders.Add("Content-Type");
            });

            //Cấu hìh redis
            builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
            {
                var configuration = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
                return ConnectionMultiplexer.Connect(configuration);
            });

            //Regiter services
            builder.Services.AddScoped<UrlService>();
            builder.Services.AddScoped<IUrlRepository, UrlRepository>();
            builder.Services.AddScoped<ICacheRepository, CacheRepository>();

            //cấu hình db
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

                options.AddFixedWindowLimiter("fixed-limiter", limiterOptions =>
                {
                    limiterOptions.PermitLimit = 10; // Tối đa 10 request
                    limiterOptions.Window = TimeSpan.FromMinutes(1); // Trong khoảng 1 phút
                    limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    limiterOptions.QueueLimit = 0; // Không hàng đợi, vượt quá lỗi luôn
                });
            });

       


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // app.UseHttpsRedirection();
            
            // Middleware log HTTP request/response
            app.UseHttpLogging();
            
            // Sử dụng Rate Limiting Middleware trước Routing và Endpoints
            app.UseRateLimiter();

            app.UseAuthorization();
            
            //  QUAN TRỌNG: Map controllers để route hoạt động
            app.MapControllers();
            app.MapGet("/", () => "🚀 API is running...");           
            app.Run();           
        }
    }
}
