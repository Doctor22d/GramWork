# GramWork Frontend Deployment Guide

This guide covers deployment options for the GramWork frontend application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Docker & Docker Compose (for containerized deployment)
- Git

## Local Development

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your backend service URLs.

4. Start development server:
```bash
npm run dev
```

Application will be available at `http://localhost:5173`

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Deployment

### Quick Start with Docker Compose

1. Build and start the container:
```bash
docker-compose up -d
```

Application will be available at `http://localhost:3000`

2. View logs:
```bash
docker-compose logs -f gramwork-frontend
```

3. Stop the container:
```bash
docker-compose down
```

### Manual Docker Build

1. Build the Docker image:
```bash
docker build -t gramwork-frontend:latest .
```

2. Run the container:
```bash
docker run -d \
  --name gramwork-frontend \
  -p 3000:80 \
  --add-host=host.docker.internal:host-gateway \
  gramwork-frontend:latest
```

3. Check health status:
```bash
curl http://localhost:3000/health
```

### Docker Configuration

The Docker setup includes:
- **Multi-stage build**: Optimized image size (~50MB compressed)
- **Nginx server**: Production-ready web server with compression
- **API proxying**: Automatic routing to backend services
- **Health checks**: Container health monitoring
- **Security headers**: X-Frame-Options, CSP, etc.

## Production Deployment

### Prerequisites

Ensure all backend services are running on ports 8081-8088:
- Auth Service: 8081
- Profile Service: 8082
- Job Service: 8083
- Assignment Service: 8084
- Attendance Service: 8085
- Payment Service: 8086
- AI Matching Service: 8087
- Notification Service: 8088

### Build for Production

1. Install dependencies:
```bash
npm ci --production=false
```

2. Build the application:
```bash
npm run build
```

3. The production build will be in the `dist` directory.

### Deploy to Web Server

#### Using Nginx

1. Copy build files to web server:
```bash
scp -r dist/* user@server:/var/www/gramwork
```

2. Configure Nginx (sample configuration in `nginx.conf`)

3. Restart Nginx:
```bash
sudo systemctl restart nginx
```

#### Using Docker in Production

1. Build production image:
```bash
docker build -t gramwork-frontend:v1.0.0 .
```

2. Tag for registry:
```bash
docker tag gramwork-frontend:v1.0.0 registry.example.com/gramwork-frontend:v1.0.0
```

3. Push to registry:
```bash
docker push registry.example.com/gramwork-frontend:v1.0.0
```

4. Deploy on production server:
```bash
docker pull registry.example.com/gramwork-frontend:v1.0.0
docker run -d \
  --name gramwork-frontend \
  -p 80:80 \
  --restart unless-stopped \
  --add-host=host.docker.internal:host-gateway \
  registry.example.com/gramwork-frontend:v1.0.0
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow for automated testing and deployment.

### Pipeline Stages

1. **Test & Lint**
   - Run ESLint
   - TypeScript type checking
   - Unit tests with Vitest
   - Coverage reporting

2. **Build**
   - Production build
   - Artifact upload
   - Build verification

3. **Docker Build & Push**
   - Multi-platform Docker build (amd64, arm64)
   - Push to GitHub Container Registry
   - Cache optimization

4. **Security Scan**
   - npm audit
   - Snyk vulnerability scanning

5. **Notification**
   - Deployment summary
   - Status reporting

### Workflow Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch

### Required Secrets

Configure these in GitHub repository settings:

- `GITHUB_TOKEN`: Automatically provided by GitHub
- `SNYK_TOKEN`: (Optional) For Snyk security scanning
- Additional deployment secrets as needed

### Using the Pipeline

1. Push code to trigger workflow:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

2. Monitor workflow in GitHub Actions tab

3. Pull published image:
```bash
docker pull ghcr.io/your-org/gramwork-frontend:latest
```

## Environment Configuration

### Environment Variables

Create `.env` file based on `.env.example`:

```env
# Backend Service URLs
VITE_AUTH_SERVICE_URL=http://localhost:8081
VITE_PROFILE_SERVICE_URL=http://localhost:8082
VITE_JOB_SERVICE_URL=http://localhost:8083
VITE_ASSIGNMENT_SERVICE_URL=http://localhost:8084
VITE_ATTENDANCE_SERVICE_URL=http://localhost:8085
VITE_PAYMENT_SERVICE_URL=http://localhost:8086
VITE_MATCHING_SERVICE_URL=http://localhost:8087
VITE_NOTIFICATION_SERVICE_URL=http://localhost:8088
VITE_WS_URL=http://localhost:8088/ws-notifications

# App Configuration
VITE_APP_NAME=GramWork
VITE_APP_VERSION=1.0.0
```

### Production Environment

For production, use environment-specific configuration:

```env
# Production Backend URLs
VITE_AUTH_SERVICE_URL=https://api.gramwork.com/auth
VITE_PROFILE_SERVICE_URL=https://api.gramwork.com/profile
VITE_JOB_SERVICE_URL=https://api.gramwork.com/job
VITE_ASSIGNMENT_SERVICE_URL=https://api.gramwork.com/assignment
VITE_ATTENDANCE_SERVICE_URL=https://api.gramwork.com/attendance
VITE_PAYMENT_SERVICE_URL=https://api.gramwork.com/payment
VITE_MATCHING_SERVICE_URL=https://api.gramwork.com/matching
VITE_NOTIFICATION_SERVICE_URL=https://api.gramwork.com/notification
VITE_WS_URL=wss://api.gramwork.com/ws-notifications
```

## Troubleshooting

### Common Issues

#### 1. Build Fails

**Problem**: Build fails with memory error

**Solution**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

#### 2. Docker Container Cannot Connect to Backend

**Problem**: API requests fail from Docker container

**Solution**:
- Use `host.docker.internal` in nginx.conf to access host services
- Or use `--network=host` flag when running container
- Check backend services are running and accessible

#### 3. WebSocket Connection Fails

**Problem**: Real-time notifications not working

**Solution**:
- Verify WebSocket endpoint URL in `.env`
- Check Nginx WebSocket proxy configuration
- Ensure backend notification service is running on port 8088
- Check browser console for WebSocket errors

#### 4. Build Size Too Large

**Problem**: Production build exceeds size limits

**Solution**:
- Enable code splitting in vite.config.ts
- Analyze bundle with `npm run build -- --analyze`
- Remove unused dependencies
- Use dynamic imports for large components

#### 5. CORS Issues

**Problem**: API requests blocked by CORS

**Solution**:
- Configure CORS in backend services
- Use Nginx proxy (already configured)
- Check API base URLs in constants.ts

### Logs and Debugging

#### Docker Logs
```bash
# View container logs
docker logs gramwork-frontend

# Follow logs in real-time
docker logs -f gramwork-frontend

# View last 100 lines
docker logs --tail 100 gramwork-frontend
```

#### Nginx Access Logs (inside container)
```bash
docker exec gramwork-frontend tail -f /var/log/nginx/access.log
docker exec gramwork-frontend tail -f /var/log/nginx/error.log
```

#### Health Check
```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' gramwork-frontend

# Manual health check
curl http://localhost:3000/health
```

### Performance Optimization

1. **Enable Compression**
   - Gzip already configured in nginx.conf
   - Verify with: `curl -H "Accept-Encoding: gzip" -I http://localhost:3000`

2. **Browser Caching**
   - Static assets cached for 1 year
   - Check Cache-Control headers

3. **Code Splitting**
   - Routes lazy loaded by default
   - Check bundle sizes in build output

4. **Image Optimization**
   - Use WebP format where possible
   - Implement lazy loading for images
   - Consider using CDN for static assets

## Support

For issues and questions:
- GitHub Issues: Create an issue in the repository
- Documentation: Check README.md and code comments
- Backend API: Verify backend services are running correctly

## Version History

- **v1.0.0** (2026-06-17): Initial production release
  - Complete authentication system
  - Role-based dashboards (Worker, Employer, Admin)
  - Real-time notifications with WebSocket
  - Maps and geolocation features
  - Comprehensive testing
  - Docker deployment
  - CI/CD pipeline
