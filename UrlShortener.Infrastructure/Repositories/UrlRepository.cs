

using Microsoft.EntityFrameworkCore;
using UrlShortener.Application.Interfaces;
using UrlShortener.Domain.Entities;
using UrlShortener.Infrastructure.Data;

namespace UrlShortener.Infrastructure.Repositories
{
    public class UrlRepository : IUrlRepository
    {
        private readonly AppDbContext _context;

        public UrlRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(ShortUrl url)
        {
            try
            {
                await _context.ShortUrls.AddAsync(url);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the exception (you can use a logging framework like Serilog, NLog, etc.)
                Console.WriteLine($"Error adding URL: {ex.Message}");
                throw; // Re-throw the exception after logging
            }
           
        }

        public async Task<ShortUrl?> GetByCodeAsync(string code)
        {
            return await _context.ShortUrls
                .FirstOrDefaultAsync(x => x.ShortCode == code);
        }
    }
}
