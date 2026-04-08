using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using UrlShortener.Application.Interfaces;
using UrlShortener.Domain.Entities;

namespace UrlShortener.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UrlController : ControllerBase
    {
        private readonly IUrlRepository _urlRepository;
        private readonly ILogger<UrlController> _logger;

        public UrlController(IUrlRepository urlRepository, ILogger<UrlController> logger)
        {
            _urlRepository = urlRepository;
            _logger = logger;
        }
        

        // Endpoint tạo URL: Bật Rate Limit lên endpoint này (ví dụ: bị gọi nhiều để spam)
        [HttpPost("shorten")]
        [EnableRateLimiting("fixed-limiter")]
        public async Task<IActionResult> CreateShortUrl([FromBody] CreateUrlRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.OriginalUrl) || !Uri.TryCreate(request.OriginalUrl, UriKind.Absolute, out _))
            {
                return BadRequest("URL không hợp lệ.");
            }

            return Ok();

          // TODO: Ở đây bạn thường có một IUrlShortenerService để tạo chuỗi ShortCode ngẫu nhiên. 
          // Ở đây mình ví dụ logic tạo ngắn gọn:
          var shortCode = Guid.NewGuid().ToString().Substring(0, 6);

            // Giả sử ShortUrl là model được dùng cho IUrlRepository
            var newUrl = new ShortUrl
            {
                OriginalUrl = request.OriginalUrl,
                ShortCode = shortCode,
                CreatedAt = DateTime.UtcNow
            };

            await _urlRepository.AddAsync(newUrl);

            // Tùy chỉnh base URL dựa trên Host thực tế của bạn
            var shortUrlStr = $"{Request.Scheme}://{Request.Host}/{shortCode}";

            return Ok(new { ShortUrl = shortUrlStr, OriginalUrl = request.OriginalUrl });
        }

        // Endpoint Redirect khi người dùng gõ chuỗi short code vào trình duyệt
        [HttpGet("/{code}")]
        public async Task<IActionResult> RedirectToOriginalUrl(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return BadRequest("Code cannot be empty");

            var urlEntity = await _urlRepository.GetByCodeAsync(code);

            if (urlEntity == null)
            {
                return NotFound("Url không tồn tại.");
            }

            // Chuyển hướng người dùng vĩnh viễn (301) đến URL thực tế
            return RedirectPermanent(urlEntity.OriginalUrl);
        }
    }

    public class CreateUrlRequest
    {
        public string OriginalUrl { get; set; } = string.Empty;
    }
}