# PowerShell Script to Setup CORS Configuration for All Microservices
# This adds CORS support to allow frontend (http://localhost:3000) to access backend APIs

$services = @(
    "ProfileService",
    "JobService",
    "Assignment-Service",
    "Attendance-Service",
    "Payment-Service",
    "AiMatchingService",
    "Notification-Service"
)

$corsConfigContent = @'
package com.gramWork.{SERVICE_PACKAGE}.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials
        config.setAllowCredentials(true);
        
        // Allow frontend origins
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173"
        ));
        
        // Allow all headers
        config.setAllowedHeaders(Collections.singletonList("*"));
        
        // Allow all HTTP methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Expose headers
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        // Apply to all paths
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
'@

Write-Host "`nSetting up CORS configuration for all microservices..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

foreach ($service in $services) {
    Write-Host "`nProcessing $service..." -ForegroundColor Yellow
    
    # Determine package name based on service directory name
    $packageName = $service -replace "-", "_"
    if ($service -eq "AiMatchingService") {
        $packageName = "AiMatchingService"
    }
    
    # Create config directory path
    $configPath = "$service\src\main\java\com\gramWork\$packageName\config"
    
    # Check if base directory exists
    if (-not (Test-Path $service)) {
        Write-Host "  ⚠ Service directory not found: $service" -ForegroundColor Red
        continue
    }
    
    # Create config directory if it doesn't exist
    if (-not (Test-Path $configPath)) {
        New-Item -ItemType Directory -Path $configPath -Force | Out-Null
        Write-Host "  ✓ Created config directory" -ForegroundColor Green
    }
    
    # Create CorsConfig.java file
    $corsFilePath = "$configPath\CorsConfig.java"
    $content = $corsConfigContent -replace "{SERVICE_PACKAGE}", $packageName
    
    Set-Content -Path $corsFilePath -Value $content -Encoding UTF8
    Write-Host "  ✓ Created CorsConfig.java" -ForegroundColor Green
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "CORS configuration setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Restart all backend services" -ForegroundColor White
Write-Host "2. Test frontend login at http://localhost:3000" -ForegroundColor White
Write-Host "3. CORS errors should be resolved!" -ForegroundColor White
Write-Host ""
