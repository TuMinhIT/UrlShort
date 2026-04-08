using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using UrlShortener.Application.DTOs.req;
using UrlShortener.Application.Services;

namespace UrlShortener.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UrlController : ControllerBase
    {
        private readonly UrlService _urlService;
        private readonly ILogger<UrlController> _logger;

        // Tiêm IUrlService (logic xử lý) thay vì IUrlRepository (truy cập dữ liệu)
        public UrlController(UrlService urlService, ILogger<UrlController> logger)
        {
            _urlService = urlService;
            _logger = logger;
        }

        [HttpPost("shorten")]
        [EnableRateLimiting("fixed-limiter")]
        public async Task<IActionResult> CreateShortUrl([FromBody] CreateUrlReq request)
        {
            try
            {
                // Gọi Service thực thi logic nghiệp vụ và lấy mã trả về
                var shortCode = await _urlService.CreateShortCodeAsync(request.OriginalUrl);

                // Tầng API chỉ lo việc Build Request URI, không để Service phải biết Host là gì
                var shortUrlStr = $"{Request.Scheme}://{Request.Host}/{shortCode}";

                return Ok(new { ShortUrl = shortUrlStr, OriginalUrl = request.OriginalUrl });
            }
            catch (ArgumentException ex) // Bắt lỗi nghiệp vụ từ Service quăng ra
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Đã xảy ra lỗi hệ thống khi tạo URL rút gọn.");
                return StatusCode(500, "Lỗi máy chủ nội bộ.");
            }
        }

        [HttpGet("/{code}")]
        public async Task<IActionResult> RedirectToOriginalUrl(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return BadRequest("Mã URL không được bỏ trống.");

            var originalUrl = await _urlService.GetOriginalUrlAsync(code);

            if (originalUrl == null)
            {
                return NotFound("URL không tồn tại.");
            }

            return RedirectPermanent(originalUrl);
        }
    }

 
}