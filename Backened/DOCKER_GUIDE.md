# Docker Deployment Guide for GramWork

Complete guide for building and deploying GramWork microservices using Docker.

## Prerequisites

- Docker Engine 24.0+ installed
- Docker Compose V2 installed
- At least 8GB RAM available
- At least 20GB disk space

## Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your actual credentials
nano .env
```

### 2. Build All Services

```bash
# Build all images
docker-compose build

# Or build specific service
docker-compose build api-gateway
```

### 3. Start All Services

```bash
# Start in detached mode
docker-compose up -d

# Or start with logs
docker-compose up
```

### 4. Check Status

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api-gateway
```

## Service Startup Order

Services start in this order automatically:

1. **Infrastructure** (Parallel)
   - MongoDB
   - Redis
   - RabbitMQ
   - Zipkin

2. **Core Services** (Sequential)
   - Config Server (waits for infrastructure)
   - Eureka Server (waits for Config Server)

3. **API Gateway** (Sequential)
   - API Gateway (waits for Eureka)

4. **Business Services** (Parallel)
   - Auth Service
   - Laborer Profile Service
   - Employer Profile Service
   - Job Service
   - Assignment Service
   - Payment Service
   - Notification Service

## Service URLs

| Service | URL | Management UI |
|---------|-----|---------------|
| API Gateway | http://localhost:8080 | - |
| Config Server | http://localhost:8888 | - |
| Eureka Server | http://localhost:8761 | Yes |
| Auth Service | http://localhost:8086 | - |
| Laborer Profile | http://localhost:8081 | - |
| Employer Profile | http://localhost:8089 | - |
| Job Service | http://localhost:8083 | - |
| Assignment Service | http://localhost:8084 | - |
| Payment Service | http://localhost:8088 | - |
| Notification Service | http://localhost:8082 | - |
| MongoDB | localhost:27017 | - |
| Redis | localhost:6379 | - |
| RabbitMQ | http://localhost:15672 | Yes (guest/guest) |
| Zipkin | http://localhost:9411 | Yes |

## Docker Commands

### Building

```bash
# Build all services
docker-compose build

# Build without cache
docker-compose build --no-cache

# Build specific service
docker-compose build gramwork-auth-service

# Build in parallel
docker-compose build --parallel
```

### Starting

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d api-gateway

# Start with rebuild
docker-compose up -d --build

# Scale specific service
docker-compose up -d --scale job-service=3
```

### Stopping

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop api-gateway

# Stop and remove containers
docker-compose down

# Stop and remove with volumes
docker-compose down -v
```

### Monitoring

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f gramwork-auth-service

# View last 100 lines
docker-compose logs --tail=100 api-gateway

# Check service status
docker-compose ps

# View resource usage
docker stats
```

### Maintenance

```bash
# Restart service
docker-compose restart api-gateway

# Rebuild and restart
docker-compose up -d --build api-gateway

# Execute command in container
docker-compose exec gramwork-auth-service sh

# View container details
docker inspect gramwork-api-gateway
```

## Health Checks

All services include health checks. Check health status:

```bash
# Gateway health
curl http://localhost:8080/actuator/health | jq

# Eureka health
curl http://localhost:8761/actuator/health | jq

# Config Server health
curl http://localhost:8888/actuator/health | jq

# Auth Service health
curl http://localhost:8086/actuator/health | jq

# Check all services
for port in 8080 8086 8081 8083 8084 8088 8082 8089 8761 8888; do
  echo "Checking port $port..."
  curl -s http://localhost:$port/actuator/health | jq -r '.status'
done
```

## Troubleshooting

### Service Won't Start

**Problem:** Container exits immediately

**Solutions:**
```bash
# Check logs
docker-compose logs service-name

# Check if dependencies are healthy
docker-compose ps

# Verify environment variables
docker-compose config

# Check port conflicts
netstat -an | grep 8080
```

### Service Can't Connect to MongoDB

**Problem:** Connection refused to MongoDB

**Solutions:**
```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Verify network
docker network inspect gramwork-network

# Test connection
docker-compose exec gramwork-auth-service ping mongodb
```

### Config Server Not Reachable

**Problem:** Services can't fetch configuration

**Solutions:**
```bash
# Check Config Server health
curl http://localhost:8888/actuator/health

# Check Config Server logs
docker-compose logs config-server

# Verify config repository volume
docker-compose exec config-server ls -la /config-repository

# Test config endpoint
curl -u config:config123 http://localhost:8888/gramwork-auth-service/default
```

### Eureka Registration Issues

**Problem:** Services not registering with Eureka

**Solutions:**
```bash
# Check Eureka dashboard
open http://localhost:8761

# Check service logs for Eureka errors
docker-compose logs gramwork-auth-service | grep -i eureka

# Verify Eureka Server is healthy
curl http://localhost:8761/actuator/health

# Check network connectivity
docker-compose exec gramwork-auth-service ping eureka-server
```

### Out of Memory

**Problem:** Container crashes with OOM

**Solutions:**
```bash
# Increase JVM memory in docker-compose.yml
# Add: JAVA_OPTS: "-Xmx1024m -Xms512m"

# Check container memory limit
docker stats

# Restart with more resources
docker-compose up -d --force-recreate
```

## Performance Optimization

### Resource Limits

Add to docker-compose.yml:

```yaml
services:
  api-gateway:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1024M
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Build Cache

```bash
# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker-compose build

# Enable BuildKit by default
export DOCKER_BUILDKIT=1
```

### Multi-Stage Builds

All Dockerfiles use multi-stage builds:
- Stage 1: Maven build (discarded)
- Stage 2: Runtime with minimal Alpine image

## Production Deployment

### Security Hardening

1. **Change default credentials**
   ```bash
   # Update .env with strong passwords
   MONGO_ROOT_PASSWORD=<strong-password>
   CONFIG_PASSWORD=<strong-password>
   EUREKA_PASSWORD=<strong-password>
   JWT_SECRET=<strong-secret-256-bits>
   ```

2. **Use secrets management**
   ```yaml
   # Use Docker secrets instead of environment variables
   secrets:
     mongodb_password:
       external: true
   ```

3. **Enable HTTPS**
   ```yaml
   # Add SSL certificates
   volumes:
     - ./ssl:/ssl:ro
   environment:
     SERVER_SSL_ENABLED: true
     SERVER_SSL_KEY_STORE: /ssl/keystore.p12
   ```

### High Availability

1. **Scale services**
   ```bash
   docker-compose up -d --scale job-service=3
   docker-compose up -d --scale assignment-service=2
   ```

2. **Load balancing**
   - Use external load balancer (Nginx, HAProxy)
   - Or use Docker Swarm/Kubernetes

3. **Database replication**
   ```yaml
   # MongoDB replica set
   mongodb-primary:
     ...
   mongodb-secondary1:
     ...
   mongodb-secondary2:
     ...
   ```

### Monitoring

1. **Container metrics**
   ```bash
   docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
   ```

2. **Application metrics**
   - Prometheus: Scrape /actuator/prometheus
   - Grafana: Visualize metrics
   - Zipkin: Distributed tracing

3. **Log aggregation**
   ```yaml
   # Send logs to ELK stack
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

## Backup and Restore

### Backup MongoDB

```bash
# Backup all databases
docker-compose exec mongodb mongodump --out /data/backup

# Copy backup from container
docker cp gramwork-mongodb:/data/backup ./mongodb-backup-$(date +%Y%m%d)

# Backup specific database
docker-compose exec mongodb mongodump --db GramWorkAuth --out /data/backup
```

### Restore MongoDB

```bash
# Copy backup to container
docker cp ./mongodb-backup gramwork-mongodb:/data/restore

# Restore all databases
docker-compose exec mongodb mongorestore /data/restore

# Restore specific database
docker-compose exec mongodb mongorestore --db GramWorkAuth /data/restore/GramWorkAuth
```

### Backup Volumes

```bash
# Backup MongoDB volume
docker run --rm -v gramwork_mongodb_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/mongodb-data.tar.gz /data

# Restore MongoDB volume
docker run --rm -v gramwork_mongodb_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/mongodb-data.tar.gz -C /
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: docker-compose build
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker-compose push
      
      - name: Deploy to server
        run: |
          ssh user@server 'cd /app && docker-compose pull && docker-compose up -d'
```

## Best Practices

1. **Always use .env file** - Never commit secrets
2. **Tag images properly** - Use semantic versioning
3. **Monitor resource usage** - Set appropriate limits
4. **Use health checks** - Ensure services are truly ready
5. **Log appropriately** - Use structured logging
6. **Regular backups** - Automate database backups
7. **Update regularly** - Keep base images updated
8. **Test locally** - Test docker-compose before deploying
9. **Use volumes** - For persistent data
10. **Network isolation** - Use custom networks

## Common Issues

### Port Already in Use

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "8081:8080"
```

### Permission Denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again
newgrp docker
```

### Disk Space Full

```bash
# Clean up unused images
docker system prune -a

# Remove unused volumes
docker volume prune

# Remove stopped containers
docker container prune
```

## Support

For Docker deployment issues:
1. Check logs: `docker-compose logs service-name`
2. Verify configuration: `docker-compose config`
3. Check resource usage: `docker stats`
4. Review this guide
5. Contact GramWork DevOps team

## License

Copyright © 2024 GramWork. All rights reserved.
