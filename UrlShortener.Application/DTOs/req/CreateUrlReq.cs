using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrlShortener.Application.DTOs.req
{
    public class CreateUrlReq
    {
        public string OriginalUrl { get; set; } = string.Empty;
        public string Ip { get; set; } = string.Empty;
    }

}
