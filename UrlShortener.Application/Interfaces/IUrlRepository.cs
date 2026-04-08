using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrlShortener.Application.Entity;

namespace UrlShortener.Application.Interfaces
{
    public interface IUrlRepository
    {
        Task<ShortUrl?> GetByCodeAsync(string code);
        Task AddAsync(ShortUrl url);
    }
}
