# GramWork - Quick Start Guide

Get the GramWork platform running in minutes!

## Prerequisites

- **Docker Desktop** (with Docker Compose)
- **Git**
- **8GB RAM** minimum (16GB recommended for full stack)

## Option 1: Frontend Only (Quick Demo)

Perfect for frontend development or when backend is already running separately.

### Windows (PowerShell)

```powershell
# 1. Setup
.\scripts\deploy.ps1 setup

# 2. Build and start
.\scripts\deploy.ps1 build -Frontend
.\scripts\deploy.ps1 start -Frontend

# 3. Open browser
# http://localhost:3000

# View logs
.\scripts\deploy.ps1 logs -Frontend

# Stop when done
.\scripts\deploy.ps1 stop -Frontend
```

### Linux/Mac (Bash)

```bash
# 1. Setup
chmod +x scripts/deploy.sh
./scripts/deploy.sh setup

# 2. Build and start
./scripts/deploy.sh build --frontend
./scripts/deploy.sh start --frontend

# 3. Open browser
# http://localhost:3000

# View logs
./scripts/deploy.sh logs --frontend

# Stop when done
./scripts/deploy.sh stop --frontend
```

### Manual Docker Commands

```bash
# Navigate to Frontend directory
cd Frontend

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Option 2: Full Stack (All Services)

Runs frontend + all 8 backend microservices + PostgreSQL + Redis.

### Windows (PowerShell)

```powershell
# 1. Setup
.\scripts\deploy.ps1 setup

# 2. Build and start (this may take 5-10 minutes)
.\scripts\deploy.ps1 build
.\scripts\deploy.ps1 start

# 3. Wait for services to be ready (~2 minutes)
.\scripts\deploy.ps1 health

# 4. Open browser
# http://localhost:3000

# View all logs
.\scripts\deploy.ps1 logs

# Stop when done
.\scripts\deploy.ps1 stop
```

### Linux/Mac (Bash)

```bash
# 1. Setup
chmod +x scripts/deploy.sh
./scripts/deploy.sh setup

# 2. Build and start (this may take 5-10 minutes)
./scripts/deploy.sh build
./scripts/deploy.sh start

# 3. Wait for services to be ready (~2 minutes)
./scripts/deploy.sh health

# 4. Open browser
# http://localhost:3000

# View all logs
./scripts/deploy.sh logs

# Stop when done
./scripts/deploy.sh stop
```

### Manual Docker Commands

```bash
# Build and start all services
docker-compose -f docker-compose.full-stack.yml up -d

# View logs
docker-compose -f docker-compose.full-stack.yml logs -f

# Stop all services
docker-compose -f docker-compose.full-stack.yml down
```

## Accessing the Application

### Frontend
- **URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### Backend Services (Full Stack Only)
- **Auth Service**: http://localhost:8081
- **Profile Service**: http://localhost:8082
- **Job Service**: http://localhost:8083
- **Assignment Service**: http://localhost:8084
- **Attendance Service**: http://localhost:8085
- **Payment Service**: http://localhost:8086
- **AI Matching Service**: http://localhost:8087
- **Notification Service**: http://localhost:8088 (WebSocket)

### Database & Cache (Full Stack Only)
- **PostgreSQL**: localhost:5432
  - Username: `gramwork`
  - Password: `gramwork_password`
- **Redis**: localhost:6379

## Test Credentials

### Worker Account
```
Email: worker@test.com
Password: Worker123!
```

### Employer Account
```
Email: employer@test.com
Password: Employer123!
```

### Admin Account
```
Email: admin@gramwork.com
Password: Admin123!
```

## Common Commands

### Check Service Status

```powershell
# Windows
.\scripts\deploy.ps1 health

# Linux/Mac
./scripts/deploy.sh health
```

### View Logs

```powershell
# All services logs
docker-compose logs -f

# Specific service
docker logs gramwork-frontend
docker logs auth-service
```

### Restart Services

```powershell
# Windows
.\scripts\deploy.ps1 restart

# Linux/Mac
./scripts/deploy.sh restart
```

### Clean Up Everything

```powershell
# Windows (removes all containers, volumes, images)
.\scripts\deploy.ps1 clean

# Linux/Mac
./scripts/deploy.sh clean
```

## Development Workflow

### Frontend Development (Hot Reload)

```bash
# Instead of Docker, use development server for hot reload
cd Frontend
npm install
npm run dev
# Access at http://localhost:5173
```

### Backend Running, Frontend Development

```bash
# Start only backend services
docker-compose -f docker-compose.full-stack.yml up -d \
  postgres redis \
  auth-service profile-service job-service assignment-service \
  attendance-service payment-service matching-service notification-service

# Run frontend in dev mode
cd Frontend
npm run dev
```

## Troubleshooting

### Port Already in Use

**Problem**: Error starting services - port already allocated

**Solution**:
```bash
# Check what's using the port
netstat -ano | findstr :3000   # Windows
lsof -i :3000                   # Linux/Mac

# Stop conflicting service or change port in docker-compose.yml
```

### Docker Out of Memory

**Problem**: Services crashing or slow performance

**Solution**:
- Increase Docker Desktop memory limit to 8GB+
- Docker Desktop → Settings → Resources → Memory

### Cannot Connect to Backend

**Problem**: API requests fail from frontend

**Solution**:
1. Check backend services are running:
   ```bash
   docker ps
   ```

2. Check backend health:
   ```bash
   curl http://localhost:8081/actuator/health
   ```

3. Verify environment variables in `Frontend/.env`

### Database Connection Failed

**Problem**: Backend services can't connect to database

**Solution**:
1. Wait 30 seconds for PostgreSQL to fully start
2. Check PostgreSQL logs:
   ```bash
   docker logs gramwork-postgres
   ```

3. Verify database was initialized:
   ```bash
   docker exec -it gramwork-postgres psql -U gramwork -c "\l"
   ```

### WebSocket Not Working

**Problem**: Real-time notifications not appearing

**Solution**:
1. Check notification service is running:
   ```bash
   docker logs notification-service
   ```

2. Verify WebSocket URL in browser console
3. Check Redis is running:
   ```bash
   docker exec gramwork-redis redis-cli ping
   ```

## Next Steps

1. **Explore the Platform**
   - Login with test credentials
   - Navigate through Worker, Employer, and Admin dashboards
   - Test job posting, worker search, and assignment workflows

2. **Review Documentation**
   - Frontend: `Frontend/README.md`
   - Deployment: `Frontend/DEPLOYMENT.md`
   - API Documentation: Check backend service READMEs

3. **Development Setup**
   - Set up IDE with ESLint and Prettier
   - Review code structure and architecture
   - Run tests: `cd Frontend && npm test`

4. **Customize**
   - Update environment variables
   - Configure authentication settings
   - Adjust service ports if needed
   - Add custom business logic

## Support

### Logs Location
- **Frontend logs**: `docker logs gramwork-frontend`
- **Backend logs**: `docker logs <service-name>`
- **PostgreSQL logs**: `docker logs gramwork-postgres`
- **Redis logs**: `docker logs gramwork-redis`

### Health Checks
```bash
# Frontend
curl http://localhost:3000/health

# Backend (Spring Boot Actuator)
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
# ... (repeat for all services 8081-8088)
```

### Reset Everything
```bash
# Stop and remove everything
docker-compose -f docker-compose.full-stack.yml down -v

# Remove images
docker rmi $(docker images 'gramwork-*' -q)

# Start fresh
./scripts/deploy.sh setup
./scripts/deploy.sh build
./scripts/deploy.sh start
```

## Resources

- **GitHub Repository**: [Your repo URL]
- **Frontend Documentation**: `Frontend/README.md`
- **Deployment Guide**: `Frontend/DEPLOYMENT.md`
- **API Documentation**: Backend service docs
- **Issue Tracker**: GitHub Issues

---

**Happy Coding! 🚀**
