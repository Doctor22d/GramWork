# GramWork Deployment Script for Windows (PowerShell)
# This script helps deploy the GramWork application on Windows

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter()]
    [switch]$Frontend
)

$ErrorActionPreference = "Stop"

# Colors
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$White = "White"

# Helper functions
function Print-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor $Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor $Red
}

function Print-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor $Yellow
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor $White
}

# Check prerequisites
function Check-Prerequisites {
    Print-Info "Checking prerequisites..."
    
    # Check Docker
    try {
        $null = docker --version
        Print-Success "Docker is installed"
    }
    catch {
        Print-Error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    }
    
    # Check Docker Compose
    try {
        $null = docker-compose --version
        Print-Success "Docker Compose is installed"
    }
    catch {
        try {
            $null = docker compose version
            Print-Success "Docker Compose (V2) is installed"
        }
        catch {
            Print-Error "Docker Compose is not installed."
            exit 1
        }
    }
    
    # Check if Docker is running
    try {
        $null = docker info 2>$null
        Print-Success "Docker daemon is running"
    }
    catch {
        Print-Error "Docker daemon is not running. Please start Docker Desktop."
        exit 1
    }
}

# Setup environment
function Setup-Environment {
    Print-Info "Setting up environment..."
    
    if (-not (Test-Path "Frontend\.env")) {
        if (Test-Path "Frontend\.env.example") {
            Copy-Item "Frontend\.env.example" "Frontend\.env"
            Print-Success "Created Frontend\.env from example"
        }
        else {
            Print-Warning "Frontend\.env.example not found"
        }
    }
    else {
        Print-Info "Frontend\.env already exists"
    }
}

# Build services
function Build-Services {
    param([bool]$FrontendOnly)
    
    Print-Info "Building Docker images..."
    
    if ($FrontendOnly) {
        docker-compose -f Frontend\docker-compose.yml build
        Print-Success "Frontend image built successfully"
    }
    else {
        docker-compose -f docker-compose.full-stack.yml build
        Print-Success "All service images built successfully"
    }
}

# Start services
function Start-Services {
    param([bool]$FrontendOnly)
    
    Print-Info "Starting services..."
    
    if ($FrontendOnly) {
        docker-compose -f Frontend\docker-compose.yml up -d
        Print-Success "Frontend service started"
        Print-Info "Frontend available at: http://localhost:3000"
    }
    else {
        docker-compose -f docker-compose.full-stack.yml up -d
        Print-Success "All services started"
        Print-Info "Frontend available at: http://localhost:3000"
        Print-Info "Backend services running on ports 8081-8088"
    }
}

# Stop services
function Stop-Services {
    param([bool]$FrontendOnly)
    
    Print-Info "Stopping services..."
    
    if ($FrontendOnly) {
        docker-compose -f Frontend\docker-compose.yml down
        Print-Success "Frontend service stopped"
    }
    else {
        docker-compose -f docker-compose.full-stack.yml down
        Print-Success "All services stopped"
    }
}

# View logs
function View-Logs {
    param([bool]$FrontendOnly)
    
    if ($FrontendOnly) {
        docker-compose -f Frontend\docker-compose.yml logs -f
    }
    else {
        docker-compose -f docker-compose.full-stack.yml logs -f
    }
}

# Health check
function Check-Health {
    param([bool]$FrontendOnly)
    
    Print-Info "Checking service health..."
    
    # Check frontend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Print-Success "Frontend is healthy"
        }
    }
    catch {
        Print-Error "Frontend is not responding"
    }
    
    if (-not $FrontendOnly) {
        # Check backend services
        for ($port = 8081; $port -le 8088; $port++) {
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:$port/actuator/health" -UseBasicParsing -TimeoutSec 3
                if ($response.StatusCode -eq 200) {
                    Print-Success "Service on port $port is healthy"
                }
            }
            catch {
                Print-Warning "Service on port $port is not responding"
            }
        }
    }
}

# Clean up
function Cleanup {
    param([bool]$FrontendOnly)
    
    Print-Info "Cleaning up..."
    
    $confirm = Read-Host "This will remove all containers, volumes, and images. Continue? (y/N)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        if ($FrontendOnly) {
            docker-compose -f Frontend\docker-compose.yml down -v --rmi all
        }
        else {
            docker-compose -f docker-compose.full-stack.yml down -v --rmi all
        }
        Print-Success "Cleanup completed"
    }
    else {
        Print-Info "Cleanup cancelled"
    }
}

# Show usage
function Show-Usage {
    Write-Host @"
GramWork Deployment Script (Windows)

Usage: .\deploy.ps1 [COMMAND] [-Frontend]

Commands:
    setup           Setup environment and check prerequisites
    build           Build Docker images
    start           Start services
    stop            Stop services
    restart         Restart services
    logs            View service logs
    health          Check service health
    clean           Clean up containers, volumes, and images
    help            Show this help message

Options:
    -Frontend       Run command for frontend only (default: full stack)

Examples:
    .\deploy.ps1 setup
    .\deploy.ps1 build -Frontend
    .\deploy.ps1 start
    .\deploy.ps1 logs -Frontend
    .\deploy.ps1 health
    .\deploy.ps1 stop
    .\deploy.ps1 clean

"@
}

# Main script
$FrontendOnly = $Frontend.IsPresent

switch ($Command.ToLower()) {
    "setup" {
        Check-Prerequisites
        Setup-Environment
        Print-Success "Setup completed"
    }
    "build" {
        Check-Prerequisites
        Build-Services -FrontendOnly $FrontendOnly
    }
    "start" {
        Check-Prerequisites
        Start-Services -FrontendOnly $FrontendOnly
    }
    "stop" {
        Stop-Services -FrontendOnly $FrontendOnly
    }
    "restart" {
        Stop-Services -FrontendOnly $FrontendOnly
        Start-Sleep -Seconds 2
        Start-Services -FrontendOnly $FrontendOnly
    }
    "logs" {
        View-Logs -FrontendOnly $FrontendOnly
    }
    "health" {
        Check-Health -FrontendOnly $FrontendOnly
    }
    "clean" {
        Cleanup -FrontendOnly $FrontendOnly
    }
    "help" {
        Show-Usage
    }
    default {
        Print-Error "Unknown command: $Command"
        Write-Host ""
        Show-Usage
        exit 1
    }
}
