using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrlShortener.Application.IRepositories
{
    public interface ICacheRepository
    {
        Task<string?> GetAsync(string key);
        Task SetAsync(string key, string value, TimeSpan? expiry = null);
        Task SetCountAsync(string key, long value);
        Task<long?> GetCountAsync(string key);
    }
}
