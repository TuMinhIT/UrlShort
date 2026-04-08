

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
            await _context.ShortUrls.AddAsync(url);
            await _context.SaveChangesAsync();
        }

        public async Task<ShortUrl?> GetByCodeAsync(string code)
        {
            return await _context.ShortUrls
                .FirstOrDefaultAsync(x => x.ShortCode == code);
        }
    }
}
