

namespace UrlShortener.Domain.Entities
{
    public class ShortUrl
    {
        public int Id { get; set; }
        public string ShortCode { get; set; }
        public string OriginalUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
