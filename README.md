# UrlShort - URL Shortener

A full-stack project featuring a **ASP.NET Core 8** backend (Clean Architecture) and **React + TypeScript + Vite** frontend.

## Project Structure

### Backend (.NET)

- `UrlShortener/` - API host (Controller, Program, appsettings)
- `UrlShortener.Application/` - Services, DTOs, Repository interfaces
- `UrlShortener.Domain/` - Domain entities
- `UrlShortener.Infrastructure/` - EF Core DbContext, Migrations, SQL/Redis repositories
- `docker-compose.yml` - Orchestration for SQL Server, Redis, API

### Frontend (React)

- `url-shortener-ui/` - React UI with TypeScript + Vite

## Backend Features

- Generate shortened URLs from long URLs
- Redirect to original URL by shortcode
- Real-time click tracking (Redis cache + stream events)
- Fetch total click count by shortcode
- List URLs created by IP address
- API rate limiting (Fixed Window Limiter: 10 req/min)
- Auto-migration DB on startup
- Retry logic on transient failures

## Technology Stack

**Backend:**

- .NET 8, ASP.NET Core Web API
- Entity Framework Core + SQL Server
- Redis (cache + stream events)
- Docker Compose

**Frontend:**

- React 18 + TypeScript
- Vite (fast build tool)
- Tailwind CSS / Custom CSS
- Axios / Fetch API

---

## Getting Started

### Backend (Docker)

**Requirements:**

- Docker Desktop

**Step 1: Start backend + SQL Server + Redis**

```bash
docker compose up --build
```

After running:

- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/swagger`
- SQL Server (host): `localhost:1434`
- Redis: `localhost:6379`

**Stop:**

```bash
docker compose down
```

---

### Frontend (npm)

**Requirements:**

- Node.js 18+
- npm

**Step 1: Install dependencies**

```bash
cd url-shortener-ui
npm install
```

**Step 2: Run dev server**

```bash
npm run dev
```

Frontend will run at: `http://localhost:5173` (Vite default port)

## Notes

- Database migrations run automatically on API startup
- SQL Server retry logic: 5 attempts, max delay 10s
- Rate limiter: 10 requests/minute per instance
- CORS enabled for local frontend development
- Swagger UI available for API testing
