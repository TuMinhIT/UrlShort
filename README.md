# UrlShort - URL Shortener

Du an gom backend ASP.NET Core 8 (Clean Architecture) va frontend React + Vite.

## Kien truc thu muc

- `UrlShortener/`: API host (controller, Program, appsettings)
- `UrlShortener.Application/`: service, DTO, interface repository
- `UrlShortener.Domain/`: entity domain
- `UrlShortener.Infrastructure/`: EF Core DbContext, migration, repository SQL/Redis
- `url-shortener-ui/`: giao dien React
- `docker-compose.yml`: chay SQL Server, Redis, API bang Docker

## Tinh nang backend

- Tao URL rut gon tu URL goc
- Redirect theo ma rut gon
- Theo doi click (cache Redis + stream event)
- Lay tong so click theo ma
- Lay danh sach URL theo IP tao URL
- Gioi han tan suat API shorten (fixed window limiter)

## Cong nghe

- .NET 8, ASP.NET Core Web API
- Entity Framework Core + SQL Server
- Redis (cache + stream)
- React + TypeScript + Vite
- Docker Compose

## Cac API chinh

Base URL local backend khi chay bang Docker: `http://localhost:5000`

1. Tao URL rut gon

- Method: `POST`
- Path: `/api/url/shorten`
- Body:

```json
{
  "originalUrl": "https://example.com/very-long-link",
  "ip": "127.0.0.1"
}
```

- Response mau:

```json
{
  "shortcode": "AbC123451",
  "shortUrl": "http://localhost:5000/AbC123451",
  "originalUrl": "https://example.com/very-long-link"
}
```

2. Redirect URL goc

- Method: `GET`
- Path: `/{code}`
- Vi du: `/AbC123451`

3. Lay so click theo ma

- Method: `GET`
- Path: `/api/url/click/{code}`

4. Lay danh sach URL theo IP client

- Method: `GET`
- Path: `/api/url/urls`
- API uu tien lay IP tu header `X-Forwarded-For`, neu khong co se lay `RemoteIpAddress`.

## Chay nhanh bang Docker (khuyen nghi)

Yeu cau:

- Docker Desktop

Lenh:

```bash
docker compose up --build
```

Sau khi chay:

- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/swagger`
- SQL Server host port: `1434`
- Redis host port: `6379`

Dung lai:

```bash
docker compose down
```

## Chay backend khong dung Docker

Yeu cau:

- .NET SDK 8
- SQL Server va Redis dang chay local

Buoc:

1. Chinh connection string trong `UrlShortener/appsettings.json` neu can.
2. Tu thu muc goc du an, chay:

```bash
dotnet run --project UrlShortener/UrlShortener.csproj
```

## Ghi chu

- Du an dang co migration trong `UrlShortener.Infrastructure/Migrations`.
- API shorten dang duoc limit 10 request/phut cho moi instance app.
