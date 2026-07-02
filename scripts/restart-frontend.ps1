# Complete Frontend Restart Script
# This clears all caches and restarts the dev server

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  FRONTEND COMPLETE RESTART" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Navigate to Frontend directory
$frontendPath = "Frontend"
if (-not (Test-Path $frontendPath)) {
    $frontendPath = "..\Frontend"
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "Error: Frontend directory not found!" -ForegroundColor Red
    Write-Host "Please run this script from project root or Backened directory" -ForegroundColor Yellow
    exit 1
}

cd $frontendPath

Write-Host "1. Clearing Vite cache..." -ForegroundColor Yellow
Remove-Item -Path "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   ✓ Vite cache cleared" -ForegroundColor Green

Write-Host "`n2. Clearing dist folder..." -ForegroundColor Yellow
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   ✓ Dist folder cleared" -ForegroundColor Green

Write-Host "`n3. Instructions:" -ForegroundColor Cyan
Write-Host "   - Make sure the dev server is STOPPED (Ctrl+C)" -ForegroundColor White
Write-Host "   - Close ALL browser tabs with localhost:3000" -ForegroundColor White
Write-Host "   - Clear browser cache (Ctrl+Shift+Delete)" -ForegroundColor White

Write-Host "`n4. Starting fresh dev server..." -ForegroundColor Yellow
Write-Host "   Running: npm run dev" -ForegroundColor White
Write-Host "`n   Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "========================================`n" -ForegroundColor Cyan

# Start dev server
npm run dev
