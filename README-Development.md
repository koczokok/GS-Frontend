# Development Setup

This guide explains how to set up the development environment using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gs-project
   ```

2. **Create environment file**
   ```bash
   cp .env.development.example .env
   # Edit .env with your configuration
   ```

3. **Start development environment**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

4. **View logs (optional)**
   ```bash
   docker compose -f docker-compose.dev.yml logs -f
   ```

## Services

The development environment includes:

- **PostgreSQL** (Database): `http://localhost:5432`
- **Spring Boot Backend** (API): `http://localhost:8080`
- **Next.js Frontend** (Web App): `http://localhost:3000`
- **Redis** (Cache): `localhost:6379`
- **PgAdmin** (Database Admin): `http://localhost:5050`

### PgAdmin Access
- Email: `admin@gs.dev`
- Password: `admin`

## Development Workflow

### Backend Development
- Code changes are hot-reloaded automatically
- Debug port: `5005` (attach debugger in your IDE)
- Logs available via: `docker compose -f docker-compose.dev.yml logs backend -f`

### Frontend Development
- Hot module replacement enabled
- File watching with polling for better compatibility
- Logs available via: `docker compose -f docker-compose.dev.yml logs frontend -f`

### Database Development
- Use PgAdmin at `http://localhost:5050` for database management
- Or connect directly to `localhost:5432` with your preferred tool
- Schema changes are applied automatically via Hibernate

## Useful Commands

```bash
# Start all services
docker compose -f docker-compose.dev.yml up -d

# Stop all services
docker compose -f docker-compose.dev.yml down

# Rebuild specific service
docker compose -f docker-compose.dev.yml build backend

# View logs
docker compose -f docker-compose.dev.yml logs -f [service-name]

# Execute commands in running containers
docker compose -f docker-compose.dev.yml exec backend bash
docker compose -f docker-compose.dev.yml exec frontend sh

# Clean up everything
docker compose -f docker-compose.dev.yml down -v --remove-orphans
```

## Environment Variables

Key environment variables for development:

```env
# Database
POSTGRES_DB=gs_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Backend
SPRING_PROFILES_ACTIVE=dev
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true

# Frontend
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Debugging

### Backend Debugging
- Debug port `5005` is exposed
- Attach your IDE debugger to `localhost:5005`

### Frontend Debugging
- Use browser dev tools at `http://localhost:3000`
- React DevTools extension recommended

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8080, 5432, 6379, 5050 are available
2. **Database connection issues**: Wait for PostgreSQL health check to pass
3. **Build failures**: Clear Docker cache with `docker system prune -a`

### Reset Development Environment

```bash
# Stop and remove all containers and volumes
docker compose -f docker-compose.dev.yml down -v

# Remove all images
docker compose -f docker-compose.dev.yml down --rmi all

# Clean system
docker system prune -a

# Restart
docker compose -f docker-compose.dev.yml up -d --build
```

## Production vs Development

This development setup includes:
- Hot reloading
- Debug ports
- Development databases
- Additional tools (PgAdmin, Redis)
- Relaxed security settings

For production deployment, use the main `docker-compose.yml` file.

