#!/bin/bash
# GramWork Microservices - Build All Services Script
# This script builds all microservices and infrastructure components

echo "========================================"
echo "GramWork Microservices Build Script"
echo "========================================"
echo ""

BUILD_FAILED=0

build_service() {
    local service_name=$1
    local service_path=$2
    local step=$3
    local total=$4
    
    echo "[$step/$total] Building $service_name..."
    cd "$service_path" || exit 1
    
    if mvn clean install -DskipTests; then
        echo "[SUCCESS] $service_name built successfully"
    else
        echo "[ERROR] $service_name build failed!"
        BUILD_FAILED=1
    fi
    
    cd - > /dev/null || exit 1
    echo ""
}

# Build all services
build_service "Config Server" "config-server" 1 10
build_service "Eureka Server" "eureka-server" 2 10
build_service "API Gateway" "api-gateway" 3 10
build_service "Auth Service" "Auth" 4 10
build_service "Laborer Profile Service" "laborer-profile-service" 5 10
build_service "Employer Profile Service" "employer-profile-service" 6 10
build_service "Job Service" "Job-Service" 7 10
build_service "Assignment Service" "Assignment-Service" 8 10
build_service "Payment Service" "Payment-Service" 9 10
build_service "Notification Service" "Notification-Service" 10 10

echo "========================================"
echo "Build Summary"
echo "========================================"
if [ $BUILD_FAILED -eq 0 ]; then
    echo "[SUCCESS] All services built successfully!"
    echo "You can now run: docker-compose up -d"
    exit 0
else
    echo "[ERROR] Some services failed to build"
    echo "Check the output above for details"
    exit 1
fi
