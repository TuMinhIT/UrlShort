using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Net;
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
                var ip = ResolveClientIp();
                // Gọi Service thực thi logic nghiệp vụ và lấy mã trả về
                var shortCode = await _urlService.CreateShortCodeAsync(request.OriginalUrl, ip);

                // Tầng API chỉ lo việc Build Request URI
                var shortUrlStr = $"{Request.Scheme}://{Request.Host}/{shortCode}";

                return Ok(new {ShortCode = shortCode, ShortUrl = shortUrlStr, OriginalUrl = request.OriginalUrl });
            }
            catch (ArgumentException ex) 
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

             var ip = ResolveClientIp();

            var originalUrl = await _urlService.GetOriginalUrlAsync(code, ip);

            if (originalUrl == null)
            {
                return NotFound("URL không tồn tại.");
            }
          
            return RedirectPermanent(originalUrl);
        }

        [HttpGet("click/{code}")]
        public async Task<IActionResult> GetClickCount(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return BadRequest("Mã URL không hợp lệ.");

            // lấy số click
            var clickCount = await _urlService.GetClickCountAsync(code);

            return Ok(new
            {
                ShortCode = code,
                ClickCount = clickCount
            });
        }

        [HttpGet()]
        public async Task<IActionResult> GetUrlByIp()
        {
            var ip = ResolveClientIp();
            if (string.IsNullOrWhiteSpace(ip))
            {
                return BadRequest(new {        
                Message = "Khong tim thay ip" });
            }
            
            var urls = await _urlService.GetByIpAsync(ip);
            return Ok(urls  );
        }

        private string? ResolveClientIp()
        {
            var forwardedFor = Request.Headers["X-Forwarded-For"].ToString();
            if (!string.IsNullOrWhiteSpace(forwardedFor))
            {
                return forwardedFor.Split(',')[0].Trim();
            }

            var remoteIp = HttpContext.Connection.RemoteIpAddress;
            if (remoteIp == null)
            {
                return null;
            }

            if (IPAddress.IsLoopback(remoteIp))
            {
                return "127.0.0.1";
            }

            if (remoteIp.IsIPv4MappedToIPv6)
            {
                return remoteIp.MapToIPv4().ToString();
            }

            return remoteIp.ToString();
        }

    }

 
}