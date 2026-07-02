# GramWork Deployment Checklist

Complete checklist for deploying GramWork microservices to production.

## 📋 Pre-Deployment Checklist

### Infrastructure Requirements

- [ ] **Java 21** installed on all servers
- [ ] **Maven 3.9+** installed (for builds)
- [ ] **Docker & Docker Compose** installed
- [ ] **MongoDB 7.0** cluster configured
- [ ] **Redis 7** cluster configured
- [ ] **RabbitMQ 3.12** cluster configured
- [ ] **Minimum 8GB RAM** per server
- [ ] **Minimum 20GB disk space** per server
- [ ] **Network connectivity** between all services
- [ ] **Load balancer** configured (Nginx/HAProxy)
- [ ] **SSL/TLS certificates** obtained
- [ ] **Domain names** configured
- [ ] **Firewall rules** configured
- [ ] **Backup strategy** in place

### Security Configuration

- [ ] Change all default credentials:
  - [ ] MongoDB admin password
  - [ ] Redis password
  - [ ] RabbitMQ password
  - [ ] Config Server credentials
  - [ ] Eureka Server credentials
- [ ] Generate strong JWT secret (256+ bits)
- [ ] Configure SSL/TLS certificates
- [ ] Set up firewall rules
- [ ] Enable security headers in gateway
- [ ] Configure CORS allowed origins
- [ ] Set up API rate limiting
- [ ] Enable audit logging
- [ ] Configure secrets management (Vault/AWS Secrets)
- [ ] Set up VPN for service communication
- [ ] Configure intrusion detection

### Configuration Files

- [ ] Update `config-repository/` with production values
- [ ] Set production MongoDB URIs
- [ ] Configure production Redis endpoints
- [ ] Configure production RabbitMQ endpoints
- [ ] Set production SMTP settings
- [ ] Configure payment gateway credentials
- [ ] Set up SMS provider credentials
- [ ] Configure push notification keys
- [ ] Update frontend URLs
- [ ] Set proper log levels (WARN/ERROR)
- [ ] Configure Zipkin endpoint
- [ ] Set up Prometheus endpoints

### Environment Variables

- [ ] Create production `.env` file
- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Configure all service credentials
- [ ] Set JWT_SECRET
- [ ] Configure SMTP credentials
- [ ] Set payment gateway keys
- [ ] Configure SMS provider
- [ ] Set monitoring endpoints
- [ ] Remove any development settings

### Database Setup

- [ ] MongoDB cluster is running
- [ ] Create all required databases:
  - [ ] GramWorkAuth
  - [ ] GramWorkLaborerProfile
  - [ ] GramWorkEmployerProfile
  - [ ] GramWorkJob
  - [ ] GramWorkAssignment
  - [ ] GramWorkPayment
  - [ ] GramWorkNotification
- [ ] Set up database users with proper permissions
- [ ] Configure database backups
- [ ] Set up replication
- [ ] Configure indexes
- [ ] Test database connections
- [ ] Set up monitoring

### Testing

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Load testing completed
- [ ] Security testing completed
- [ ] API endpoints tested
- [ ] Authentication flow tested
- [ ] Payment flow tested
- [ ] Notification flow tested
- [ ] Circuit breakers tested
- [ ] Rate limiting tested
- [ ] CORS configuration tested

## 🚀 Deployment Steps

### Step 1: Build All Services

```bash
# Build Docker images
docker-compose build

# Tag images with version
docker tag gramwork/api-gateway:latest gramwork/api-gateway:1.0.0
docker tag gramwork/auth-service:latest gramwork/auth-service:1.0.0
# ... tag all services

# Push to registry
docker push gramwork/api-gateway:1.0.0
docker push gramwork/auth-service:1.0.0
# ... push all services
```

- [ ] All services built successfully
- [ ] Images tagged with version
- [ ] Images pushed to registry

### Step 2: Deploy Infrastructure

```bash
# Start infrastructure services
docker-compose up -d mongodb redis rabbitmq zipkin
```

- [ ] MongoDB is running and accessible
- [ ] Redis is running and accessible
- [ ] RabbitMQ is running and accessible
- [ ] Zipkin is running and accessible
- [ ] Health checks passing

### Step 3: Deploy Core Services

```bash
# Deploy Config Server
docker-compose up -d config-server

# Wait for health check
curl http://config-server:8888/actuator/health

# Deploy Eureka Server
docker-compose up -d eureka-server

# Wait for health check
curl http://eureka-server:8761/actuator/health
```

- [ ] Config Server is running
- [ ] Config Server health check passing
- [ ] Eureka Server is running
- [ ] Eureka Server health check passing
- [ ] Services can reach Config Server
- [ ] Services can reach Eureka Server

### Step 4: Deploy API Gateway

```bash
# Deploy API Gateway
docker-compose up -d api-gateway

# Wait for health check
curl http://api-gateway:8080/actuator/health
```

- [ ] API Gateway is running
- [ ] Health check passing
- [ ] Registered with Eureka
- [ ] Configuration loaded
- [ ] Routes configured
- [ ] JWT authentication working
- [ ] Rate limiting working

### Step 5: Deploy Business Services

```bash
# Deploy all business services
docker-compose up -d \
  gramwork-auth-service \
  laborer-profile-service \
  employer-profile-service \
  job-service \
  assignment-service \
  payment-service \
  notification-service
```

- [ ] Auth Service deployed
- [ ] Laborer Profile Service deployed
- [ ] Employer Profile Service deployed
- [ ] Job Service deployed
- [ ] Assignment Service deployed
- [ ] Payment Service deployed
- [ ] Notification Service deployed
- [ ] All services registered with Eureka
- [ ] All health checks passing
- [ ] Inter-service communication working

### Step 6: Configure Load Balancer

```nginx
# Nginx configuration example
upstream api_gateway {
    server api-gateway-1:8080;
    server api-gateway-2:8080;
    server api-gateway-3:8080;
}

server {
    listen 443 ssl;
    server_name api.gramwork.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://api_gateway;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- [ ] Load balancer configured
- [ ] SSL/TLS configured
- [ ] Health checks configured
- [ ] Sticky sessions configured (if needed)
- [ ] Timeout settings configured
- [ ] Access logs configured

### Step 7: Configure Monitoring

- [ ] Prometheus scraping configured
- [ ] Grafana dashboards created
- [ ] Zipkin tracing configured
- [ ] Log aggregation configured (ELK/Splunk)
- [ ] Alerts configured
- [ ] On-call rotation set up

### Step 8: Configure Backups

- [ ] MongoDB backup scheduled
- [ ] Redis backup scheduled
- [ ] Configuration files backed up
- [ ] Backup retention policy set
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

## ✅ Post-Deployment Verification

### Health Checks

```bash
# Check all services
curl https://api.gramwork.com/actuator/health

# Check Eureka dashboard
curl https://eureka.gramwork.com

# Check Config Server
curl -u config:password https://config.gramwork.com/actuator/health

# Check all business services
for service in auth laborer-profile employer-profile job assignment payment notification; do
  echo "Checking $service..."
  curl https://api.gramwork.com/api/$service/actuator/health
done
```

- [ ] API Gateway health check passing
- [ ] All services health checks passing
- [ ] All services registered in Eureka
- [ ] No errors in logs

### Functional Testing

- [ ] User registration working
- [ ] User login working
- [ ] JWT authentication working
- [ ] Profile creation working
- [ ] Job posting working
- [ ] Job application working
- [ ] Assignment creation working
- [ ] Payment processing working
- [ ] Notifications sending
- [ ] Email notifications working
- [ ] SMS notifications working
- [ ] Push notifications working

### Performance Testing

- [ ] Response times acceptable (<500ms for most endpoints)
- [ ] API Gateway can handle expected load
- [ ] Database queries optimized
- [ ] Caching working properly
- [ ] Circuit breakers functioning
- [ ] Rate limiting working
- [ ] No memory leaks detected

### Security Testing

- [ ] HTTPS enforced
- [ ] JWT validation working
- [ ] Authorization rules enforced
- [ ] Rate limiting preventing abuse
- [ ] CORS configuration correct
- [ ] No sensitive data in logs
- [ ] SQL injection protection working
- [ ] XSS protection working

### Monitoring

- [ ] All services visible in monitoring
- [ ] Metrics being collected
- [ ] Dashboards showing data
- [ ] Alerts configured
- [ ] On-call team notified
- [ ] Runbooks available

## 🔄 Rollback Plan

If deployment fails:

1. **Stop all new services**
   ```bash
   docker-compose stop
   ```

2. **Restore previous version**
   ```bash
   docker-compose pull  # Pull previous version
   docker-compose up -d
   ```

3. **Verify rollback**
   - Check all health endpoints
   - Test critical flows
   - Monitor error rates

4. **Restore database** (if needed)
   ```bash
   mongorestore --db GramWorkAuth backup/GramWorkAuth
   ```

5. **Notify stakeholders**
   - Send incident notification
   - Update status page
   - Schedule post-mortem

## 📊 Monitoring Checklist

### Day 1 (First 24 hours)

- [ ] Check logs every hour
- [ ] Monitor error rates
- [ ] Watch CPU/Memory usage
- [ ] Verify no memory leaks
- [ ] Check database connections
- [ ] Monitor API response times
- [ ] Verify circuit breakers
- [ ] Check Eureka registrations

### Week 1

- [ ] Daily log review
- [ ] Performance metrics review
- [ ] Security audit
- [ ] Database growth monitoring
- [ ] Cost analysis
- [ ] User feedback collection

### Month 1

- [ ] Full system audit
- [ ] Security penetration testing
- [ ] Performance optimization
- [ ] Cost optimization
- [ ] Disaster recovery drill
- [ ] Documentation updates

## 🚨 Troubleshooting

### Common Issues

**Service won't start:**
- Check logs: `docker-compose logs service-name`
- Verify configuration
- Check dependencies
- Verify network connectivity

**High memory usage:**
- Check for memory leaks
- Review JVM settings
- Scale horizontally
- Optimize queries

**Slow response times:**
- Check database indexes
- Review cache hit rates
- Optimize slow queries
- Increase resources

**Services not communicating:**
- Verify Eureka registration
- Check network configuration
- Review security groups
- Test inter-service connectivity

## 📞 Emergency Contacts

- **DevOps Lead:** [Contact Info]
- **Backend Lead:** [Contact Info]
- **Database Admin:** [Contact Info]
- **Security Team:** [Contact Info]
- **On-Call Engineer:** [Contact Info]

## 📄 Documentation

- Architecture diagrams
- API documentation
- Runbooks
- Incident response procedures
- Disaster recovery plan
- Security policies
- Compliance documents

## ✅ Final Sign-Off

Before marking deployment as complete:

- [ ] All checklist items completed
- [ ] All stakeholders notified
- [ ] Documentation updated
- [ ] Monitoring confirmed working
- [ ] Backups verified
- [ ] Team trained on new features
- [ ] Post-deployment review scheduled

---

**Deployment Date:** __________  
**Deployed By:** __________  
**Approved By:** __________  
**Version:** __________  

---

## 📝 Notes

_Add any deployment-specific notes here:_

---

Copyright © 2024 GramWork. All rights reserved.
