package com.gramwork.gateway.validator;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

/**
 * Route Validator
 * Validates if a route requires authentication
 */
@Component
public class RouteValidator {

    /**
     * Public API endpoints that don't require authentication
     */
    public static final List<String> PUBLIC_ENDPOINTS = List.of(
        // Auth endpoints
        "/api/auth/login",
        "/api/auth/admin/login",
        "/api/auth/register",
        "/api/auth/send-otp",
        "/api/auth/verify-otp",
        "/api/auth/ResetPasswordMail",
        "/api/auth/ResetPassword",
        
        // Profile registration endpoints
        "/api/worker/register-worker",
        "/api/employer/register",
        
        // Validation endpoints
        "/api/job/**/checkJobID",
        "/api/worker/**/checkWorkerID",
        "/api/employer/**/CheckEmployerID",
        
        // Assignment endpoints (temporarily public for testing)
        "/api/assignments/**",
        
        // Job endpoints (temporarily public for testing)
        "/api/job/**",
        "/api/jobs/**",
        
        // Payment endpoints (temporarily public for testing)
        "/api/payments/**",
        
        // Notification endpoints (temporarily public for testing)
        "/api/notifications/**",
        
        // Profile endpoints (temporarily public for testing)
        "/api/laborers/**",
        "/api/employers/**",
        
        // Actuator endpoints
        "/actuator/health",
        "/actuator/info",
        //review endpoints
        "/api/review/postReview/**",
        
        // Swagger/OpenAPI (if needed)
        "/v3/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html"
    );

    private final org.springframework.util.AntPathMatcher pathMatcher = new org.springframework.util.AntPathMatcher();

    /**
     * Predicate to check if a path is secured (requires authentication)
     */
    public Predicate<String> isSecured = path ->
        PUBLIC_ENDPOINTS.stream()
            .noneMatch(endpoint -> pathMatcher.match(endpoint, path));

    /**
     * Check if the given path requires authentication
     */
    public boolean requiresAuthentication(String path) {
        return isSecured.test(path);
    }

    /**
     * Check if the given path is public
     */
    public boolean isPublicEndpoint(String path) {
        return !requiresAuthentication(path);
    }

    /**
     * Get all public endpoints
     */
    public List<String> getPublicEndpoints() {
        return PUBLIC_ENDPOINTS;
    }
}
