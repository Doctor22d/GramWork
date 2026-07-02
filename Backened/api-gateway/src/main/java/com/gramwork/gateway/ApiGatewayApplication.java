package com.gramwork.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * API Gateway Application
 * Central entry point for all GramWork microservices
 * 
 * Features:
 * - Dynamic routing with Eureka service discovery
 * - JWT authentication and authorization
 * - Request/response logging
 * - Circuit breaker integration
 * - Rate limiting
 * - CORS handling
 * - Distributed tracing
 * 
 * @author GramWork Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
        System.out.println("""
            
            ╔══════════════════════════════════════════════════════════╗
            ║                                                          ║
            ║       GramWork API Gateway Started Successfully         ║
            ║                                                          ║
            ║   Gateway:   http://localhost:8080                      ║
            ║   Health:    http://localhost:8080/actuator/health      ║
            ║   Routes:    http://localhost:8080/actuator/gateway/routes ║
            ║                                                          ║
            ║   Protected Routes:                                      ║
            ║   - /api/auth/**        → AUTH                          ║
            ║   - /api/laborers/**    → laborer-profile-service       ║
            ║   - /api/employers/**   → employer-profile-service      ║
            ║   - /api/jobs/**        → job-service                   ║
            ║   - /api/assignments/** → assignment-service            ║
            ║   - /api/payments/**    → payment-service               ║
            ║   - /api/notifications/** → notification-service        ║
            ║                                                          ║
            ╚══════════════════════════════════════════════════════════╝
            
            """);
    }
}
