#!/bin/bash

# GramWork Microservices Stop Script
# This script stops all running services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║       GramWork Microservices Stop Script                ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to stop process on port
stop_service() {
    local port=$1
    local service_name=$2
    
    local pid=$(lsof -ti:$port)
    
    if [ -n "$pid" ]; then
        echo -e "${YELLOW}Stopping $service_name (PID: $pid, Port: $port)...${NC}"
        kill -15 $pid 2>/dev/null
        
        # Wait for graceful shutdown
        sleep 2
        
        # Force kill if still running
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${RED}Force stopping $service_name...${NC}"
            kill -9 $pid 2>/dev/null
        fi
        
        echo -e "${GREEN}✓ $service_name stopped${NC}"
    else
        echo -e "${BLUE}ℹ $service_name is not running${NC}"
    fi
}

# Stop business services
echo -e "\n${BLUE}Stopping business services...${NC}"
stop_service 8082 "Notification Service"
stop_service 8088 "Payment Service"
stop_service 8084 "Assignment Service"
stop_service 8083 "Job Service"
stop_service 8089 "Employer Profile Service"
stop_service 8081 "Laborer Profile Service"
stop_service 8086 "Auth Service"

# Stop gateway
echo -e "\n${BLUE}Stopping API Gateway...${NC}"
stop_service 8080 "API Gateway"

# Stop core services
echo -e "\n${BLUE}Stopping core services...${NC}"
stop_service 8761 "Eureka Server"
stop_service 8888 "Config Server"

# Stop infrastructure services (Docker)
echo -e "\n${BLUE}Stopping infrastructure services...${NC}"
if command -v docker-compose &> /dev/null; then
    if docker-compose ps | grep -q "Up"; then
        echo "Stopping Docker services..."
        docker-compose stop
        echo -e "${GREEN}✓ Infrastructure services stopped${NC}"
    else
        echo -e "${BLUE}ℹ Docker services are not running${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Docker Compose not found${NC}"
fi

echo -e "\n${GREEN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║       All Services Stopped Successfully! ✓              ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "\n${BLUE}To start services again:${NC}"
echo "./START_SERVICES.sh"
echo -e "\nor with Docker:"
echo "docker-compose up -d"
