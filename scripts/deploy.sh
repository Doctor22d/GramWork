#!/bin/bash

# GramWork Deployment Script
# This script helps deploy the GramWork application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${NC}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    print_success "Docker daemon is running"
}

# Setup environment
setup_environment() {
    print_info "Setting up environment..."
    
    if [ ! -f "Frontend/.env" ]; then
        if [ -f "Frontend/.env.example" ]; then
            cp Frontend/.env.example Frontend/.env
            print_success "Created Frontend/.env from example"
        else
            print_warning "Frontend/.env.example not found"
        fi
    else
        print_info "Frontend/.env already exists"
    fi
}

# Build services
build_services() {
    print_info "Building Docker images..."
    
    if [ "$1" == "frontend-only" ]; then
        docker-compose -f Frontend/docker-compose.yml build
        print_success "Frontend image built successfully"
    else
        docker-compose -f docker-compose.full-stack.yml build
        print_success "All service images built successfully"
    fi
}

# Start services
start_services() {
    print_info "Starting services..."
    
    if [ "$1" == "frontend-only" ]; then
        docker-compose -f Frontend/docker-compose.yml up -d
        print_success "Frontend service started"
        print_info "Frontend available at: http://localhost:3000"
    else
        docker-compose -f docker-compose.full-stack.yml up -d
        print_success "All services started"
        print_info "Frontend available at: http://localhost:3000"
        print_info "Backend services running on ports 8081-8088"
    fi
}

# Stop services
stop_services() {
    print_info "Stopping services..."
    
    if [ "$1" == "frontend-only" ]; then
        docker-compose -f Frontend/docker-compose.yml down
        print_success "Frontend service stopped"
    else
        docker-compose -f docker-compose.full-stack.yml down
        print_success "All services stopped"
    fi
}

# View logs
view_logs() {
    if [ "$1" == "frontend-only" ]; then
        docker-compose -f Frontend/docker-compose.yml logs -f
    else
        docker-compose -f docker-compose.full-stack.yml logs -f
    fi
}

# Health check
health_check() {
    print_info "Checking service health..."
    
    # Check frontend
    if curl -f http://localhost:3000/health &> /dev/null; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend is not responding"
    fi
    
    if [ "$1" != "frontend-only" ]; then
        # Check backend services
        for port in {8081..8088}; do
            if curl -f http://localhost:$port/actuator/health &> /dev/null 2>&1; then
                print_success "Service on port $port is healthy"
            else
                print_warning "Service on port $port is not responding"
            fi
        done
    fi
}

# Clean up
cleanup() {
    print_info "Cleaning up..."
    
    read -p "This will remove all containers, volumes, and images. Continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$1" == "frontend-only" ]; then
            docker-compose -f Frontend/docker-compose.yml down -v --rmi all
        else
            docker-compose -f docker-compose.full-stack.yml down -v --rmi all
        fi
        print_success "Cleanup completed"
    else
        print_info "Cleanup cancelled"
    fi
}

# Show usage
show_usage() {
    cat << EOF
GramWork Deployment Script

Usage: ./deploy.sh [COMMAND] [OPTIONS]

Commands:
    setup           Setup environment and check prerequisites
    build           Build Docker images
    start           Start services
    stop            Stop services
    restart         Restart services
    logs            View service logs
    health          Check service health
    clean           Clean up containers, volumes, and images

Options:
    --frontend      Run command for frontend only (default: full stack)
    --help          Show this help message

Examples:
    ./deploy.sh setup
    ./deploy.sh build --frontend
    ./deploy.sh start
    ./deploy.sh logs --frontend
    ./deploy.sh health
    ./deploy.sh stop
    ./deploy.sh clean

EOF
}

# Main script
main() {
    # Parse arguments
    COMMAND=${1:-help}
    MODE="full-stack"
    
    if [[ "$2" == "--frontend" ]]; then
        MODE="frontend-only"
    fi
    
    # Execute command
    case $COMMAND in
        setup)
            check_prerequisites
            setup_environment
            print_success "Setup completed"
            ;;
        build)
            check_prerequisites
            build_services $MODE
            ;;
        start)
            check_prerequisites
            start_services $MODE
            ;;
        stop)
            stop_services $MODE
            ;;
        restart)
            stop_services $MODE
            sleep 2
            start_services $MODE
            ;;
        logs)
            view_logs $MODE
            ;;
        health)
            health_check $MODE
            ;;
        clean)
            cleanup $MODE
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            print_error "Unknown command: $COMMAND"
            echo
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
