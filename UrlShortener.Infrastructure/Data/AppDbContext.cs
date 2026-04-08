using Microsoft.EntityFrameworkCore;
using UrlShortener.Domain.Entities;


namespace UrlShortener.Infrastructure.Data
{
    public  class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<ShortUrl> ShortUrls { get; set; }

    }
}
