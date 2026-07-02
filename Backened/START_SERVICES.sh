#!/bin/bash

# GramWork Microservices Startup Script
# This script starts all services in the correct order

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Service ports
CONFIG_PORT=8888
EUREKA_PORT=8761
GATEWAY_PORT=8080
AUTH_PORT=8086
LABORER_PROFILE_PORT=8081
EMPLOYER_PROFILE_PORT=8089
JOB_PORT=8083
ASSIGNMENT_PORT=8084
PAYMENT_PORT=8088
NOTIFICATION_PORT=8082

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║       GramWork Microservices Startup Script             ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}✗ Port $1 is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}✓ Port $1 is available${NC}"
        return 0
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=60
    local attempt=0

    echo -e "${YELLOW}⏳ Waiting for $service_name to start...${NC}"

    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:$port/actuator/health > /dev/null 2>&1; then
            echo -e "${GREEN}✓ $service_name is ready!${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done

    echo -e "${RED}✗ $service_name failed to start after $((max_attempts * 2)) seconds${NC}"
    return 1
}

# Step 1: Check prerequisites
echo -e "\n${BLUE}[Step 1/5] Checking prerequisites...${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Java is installed: $(java -version 2>&1 | head -n 1)${NC}"
fi

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}✗ Maven is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Maven is installed: $(mvn -version | head -n 1)${NC}"
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker is not installed (infrastructure services won't start)${NC}"
else
    echo -e "${GREEN}✓ Docker is installed${NC}"
fi

# Step 2: Start infrastructure services
echo -e "\n${BLUE}[Step 2/5] Starting infrastructure services...${NC}"

if command -v docker-compose &> /dev/null; then
    echo "Starting MongoDB, Redis, RabbitMQ, and Zipkin..."
    docker-compose up -d mongodb redis rabbitmq zipkin
    
    echo "Waiting for infrastructure services to be ready..."
    sleep 10
    
    if docker ps | grep -q gramwork-mongodb; then
        echo -e "${GREEN}✓ MongoDB is running${NC}"
    else
        echo -e "${RED}✗ MongoDB failed to start${NC}"
    fi
    
    if docker ps | grep -q gramwork-redis; then
        echo -e "${GREEN}✓ Redis is running${NC}"
    else
        echo -e "${RED}✗ Redis failed to start${NC}"
    fi
    
    if docker ps | grep -q gramwork-rabbitmq; then
        echo -e "${GREEN}✓ RabbitMQ is running${NC}"
    else
        echo -e "${RED}✗ RabbitMQ failed to start${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Docker Compose not found, skipping infrastructure startup${NC}"
fi

# Step 3: Start Config Server
echo -e "\n${BLUE}[Step 3/5] Starting Config Server...${NC}"

check_port $CONFIG_PORT || exit 1

cd config-server
mvn spring-boot:run > ../logs/config-server.log 2>&1 &
CONFIG_PID=$!
cd ..

wait_for_service "Config Server" $CONFIG_PORT || exit 1

# Step 4: Start Eureka Server
echo -e "\n${BLUE}[Step 4/5] Starting Eureka Server...${NC}"

check_port $EUREKA_PORT || exit 1

cd eureka-server
mvn spring-boot:run > ../logs/eureka-server.log 2>&1 &
EUREKA_PID=$!
cd ..

wait_for_service "Eureka Server" $EUREKA_PORT || exit 1

# Step 5: Start API Gateway
echo -e "\n${BLUE}[Step 5/5] Starting API Gateway...${NC}"

check_port $GATEWAY_PORT || exit 1

cd api-gateway
mvn spring-boot:run > ../logs/api-gateway.log 2>&1 &
GATEWAY_PID=$!
cd ..

wait_for_service "API Gateway" $GATEWAY_PORT || exit 1

# Step 6: Start business services (in parallel)
echo -e "\n${BLUE}[Step 6/6] Starting business services...${NC}"

# Auth Service
check_port $AUTH_PORT
cd Auth
mvn spring-boot:run > ../logs/auth-service.log 2>&1 &
AUTH_PID=$!
cd ..

# Laborer Profile Service
check_port $LABORER_PROFILE_PORT
cd laborer-profile-service
mvn spring-boot:run > ../logs/laborer-profile-service.log 2>&1 &
LABORER_PID=$!
cd ..

# Employer Profile Service
check_port $EMPLOYER_PROFILE_PORT
cd employer-profile-service
mvn spring-boot:run > ../logs/employer-profile-service.log 2>&1 &
EMPLOYER_PID=$!
cd ..

# Job Service
check_port $JOB_PORT
cd Job-Service
mvn spring-boot:run > ../logs/job-service.log 2>&1 &
JOB_PID=$!
cd ..

# Assignment Service
check_port $ASSIGNMENT_PORT
cd Assignment-Service
mvn spring-boot:run > ../logs/assignment-service.log 2>&1 &
ASSIGNMENT_PID=$!
cd ..

# Payment Service
check_port $PAYMENT_PORT
cd Payment-Service
mvn spring-boot:run > ../logs/payment-service.log 2>&1 &
PAYMENT_PID=$!
cd ..

# Notification Service
check_port $NOTIFICATION_PORT
cd Notification-Service
mvn spring-boot:run > ../logs/notification-service.log 2>&1 &
NOTIFICATION_PID=$!
cd ..

# Wait for all business services
echo -e "\n${YELLOW}⏳ Waiting for all business services to start (this may take 2-3 minutes)...${NC}"
sleep 30

# Verify services
echo -e "\n${BLUE}Verifying services...${NC}"
wait_for_service "Auth Service" $AUTH_PORT
wait_for_service "Laborer Profile Service" $LABORER_PROFILE_PORT
wait_for_service "Employer Profile Service" $EMPLOYER_PROFILE_PORT
wait_for_service "Job Service" $JOB_PORT
wait_for_service "Assignment Service" $ASSIGNMENT_PORT
wait_for_service "Payment Service" $PAYMENT_PORT
wait_for_service "Notification Service" $NOTIFICATION_PORT

# Final status
echo -e "\n${GREEN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║       All Services Started Successfully! 🎉              ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "\n${BLUE}Service URLs:${NC}"
echo "Eureka Dashboard:    http://localhost:$EUREKA_PORT"
echo "API Gateway:         http://localhost:$GATEWAY_PORT"
echo "Config Server:       http://localhost:$CONFIG_PORT"
echo "Auth Service:        http://localhost:$AUTH_PORT"
echo "Laborer Profile:     http://localhost:$LABORER_PROFILE_PORT"
echo "Employer Profile:    http://localhost:$EMPLOYER_PROFILE_PORT"
echo "Job Service:         http://localhost:$JOB_PORT"
echo "Assignment Service:  http://localhost:$ASSIGNMENT_PORT"
echo "Payment Service:     http://localhost:$PAYMENT_PORT"
echo "Notification Service: http://localhost:$NOTIFICATION_PORT"
echo "RabbitMQ Management: http://localhost:15672"
echo "Zipkin Tracing:      http://localhost:9411"

echo -e "\n${YELLOW}Process IDs:${NC}"
echo "Config Server:    $CONFIG_PID"
echo "Eureka Server:    $EUREKA_PID"
echo "API Gateway:      $GATEWAY_PID"
echo "Auth Service:     $AUTH_PID"
echo "Laborer Profile:  $LABORER_PID"
echo "Employer Profile: $EMPLOYER_PID"
echo "Job Service:      $JOB_PID"
echo "Assignment Service: $ASSIGNMENT_PID"
echo "Payment Service:  $PAYMENT_PID"
echo "Notification Service: $NOTIFICATION_PID"

echo -e "\n${BLUE}To stop services:${NC}"
echo "Run: ./STOP_SERVICES.sh"
echo "Or manually: kill $CONFIG_PID $EUREKA_PID $GATEWAY_PID $AUTH_PID $LABORER_PID $EMPLOYER_PID $JOB_PID $ASSIGNMENT_PID $PAYMENT_PID $NOTIFICATION_PID"

echo -e "\n${BLUE}View logs:${NC}"
echo "tail -f logs/api-gateway.log"
echo "tail -f logs/auth-service.log"

echo -e "\n${GREEN}✓ Startup complete!${NC}"
