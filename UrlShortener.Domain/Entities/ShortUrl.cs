

namespace UrlShortener.Domain.Entities
{
    public class ShortUrl
    {
        public long Id { get; set; }
        public string ShortCode { get; set; }
        public string OriginalUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Ip { get; set; }
        public long CountClick { get; set; }
    }
}
