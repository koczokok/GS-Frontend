# GS Application - Docker Setup

This document provides instructions for setting up and running the GS application using Docker Compose.

## Architecture

The application consists of three main services:

- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Backend**: Spring Boot (Java 21) REST API
- **Database**: PostgreSQL 15

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

1. **Clone the repository and navigate to the project root**

2. **Create environment file** (optional, defaults are provided):
   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

3. **Start all services**:
   ```bash
   docker-compose up --build
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432 (from host machine)

## Development Workflow

### Starting Services

```bash
# Start all services in detached mode
docker-compose up -d

# Start only specific services
docker-compose up postgres backend
docker-compose up frontend

# Rebuild and start
docker-compose up --build
```

### Development Commands

```bash
# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d gs_db

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
```

### Hot Reloading

The setup includes volume mounts for hot reloading:

- **Backend**: Changes to Java source files trigger automatic recompilation
- **Frontend**: Next.js hot module replacement is enabled
- **Database**: Schema changes via Spring JPA auto-update

## Environment Configuration

### Default Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | `gs_db` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | `password` | Database password |
| `DATABASE_PORT` | `5432` | PostgreSQL port |
| `BACKEND_PORT` | `8080` | Spring Boot port |
| `FRONTEND_PORT` | `3000` | Next.js port |

### Spring Boot Profiles

- `docker`: Used when running in containers
- Add custom profiles in `SPRING_PROFILES_ACTIVE`

## Database Management

### Initial Schema

Database initialization scripts are located in `init-db.sql`. Modify this file to:
- Create initial tables
- Insert seed data
- Set up extensions

### Connecting to Database

```bash
# From host machine
psql -h localhost -p 5432 -U postgres -d gs_db

# From within backend container
docker-compose exec backend bash
# Then connect via Spring Boot datasource
```

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   - Change ports in `.env` file
   - Check `netstat -tulpn` for conflicts

2. **Database connection fails**:
   - Ensure PostgreSQL container is healthy: `docker-compose ps`
   - Check logs: `docker-compose logs postgres`

3. **Backend fails to start**:
   - Verify Java 21 compatibility
   - Check Spring Boot configuration
   - Ensure database is ready before backend starts

4. **Frontend build fails**:
   - Clear Next.js cache: `docker-compose exec frontend rm -rf .next`
   - Rebuild: `docker-compose up --build frontend`

### Health Checks

All services include health checks:
- PostgreSQL: Checks database connectivity
- Backend: Checks Spring Boot actuator health endpoint
- Frontend: Relies on successful container startup

Monitor health with:
```bash
docker-compose ps
```

## Production Deployment

For production deployment:

1. **Update environment variables** for production settings
2. **Use production Dockerfiles** with multi-stage builds
3. **Configure proper secrets management**
4. **Set up reverse proxy** (nginx/traefik)
5. **Enable HTTPS** and security headers
6. **Configure logging** and monitoring

### Production Compose Override

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  frontend:
    environment:
      - NODE_ENV=production
    command: npm start
  backend:
    environment:
      - SPRING_PROFILES_ACTIVE=prod
```

## File Structure

```
.
├── docker-compose.yml          # Main compose file
├── docker-compose.override.yml # Development overrides
├── .env                        # Environment variables (create from .env.example)
├── init-db.sql                 # Database initialization
├── Backend/
│   └── Backend/
│       ├── Dockerfile          # Spring Boot container config
│       └── pom.xml
├── Frontend/
│   ├── Dockerfile             # Next.js container config
│   ├── next.config.ts         # Updated for standalone output
│   └── package.json
└── README-Docker.md           # This file
```

## Additional Commands

```bash
# View resource usage
docker-compose top

# Restart specific service
docker-compose restart backend

# Scale services (if needed)
docker-compose up -d --scale backend=2

# Clean up
docker system prune -f
docker volume prune -f
```
