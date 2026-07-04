package com.gramwork.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Authorization Filter
 * Checks user roles and permissions for specific endpoints
 */
@Slf4j
@Component
public class AuthorizationFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String userRole = request.getHeaders().getFirst("X-User-Role");

        // Skip authorization if no role (public endpoint)
        if (userRole == null) {
            return chain.filter(exchange);
        }

        log.debug("Authorizing user with role: {} for path: {}", userRole, path);

        // Role-based authorization rules
        if (!isAuthorized(path, userRole)) {
            log.warn("Access denied for role: {} to path: {}", userRole, path);
            return onError(exchange, "Access denied - insufficient permissions", HttpStatus.FORBIDDEN);
        }

        return chain.filter(exchange);
    }

    /**
     * Check if the user role is authorized for the given path
     */
    private boolean isAuthorized(String path, String role) {
        // Admin has access to everything
        if ("ADMIN".equalsIgnoreCase(role)) {
            return true;
        }

        // Employer-specific endpoints
        if (path.startsWith("/api/employer") || path.startsWith("/api/job/postjob")) {
            return "EMPLOYER".equalsIgnoreCase(role);
        }

        // Worker-specific endpoints
        if (path.startsWith("/api/worker") || path.contains("/apply")) {
            return "WORKER".equalsIgnoreCase(role) ||"ADMIN".equalsIgnoreCase(role);
        }


        if (path.startsWith("/api/payment/create")) {
            return "EMPLOYER".equalsIgnoreCase(role);
        }
        if (path.startsWith("/api/payment") || path.startsWith("/api/invoice")) {
            return "EMPLOYER".equalsIgnoreCase(role) || "WORKER".equalsIgnoreCase(role);
        }

        // Notification endpoints - all authenticated users
        if (path.startsWith("/api/notifications")) {
            return true; // All authenticated users can access their notifications
        }
        if(path.startsWith("/api/auth/admin/login")){
            return true;
        }

        // Job viewing - all authenticated users
        if (path.startsWith("/api/job") && !path.contains("/postjob")) {
            return true; // All can view jobs
        }
        if(path.startsWith("/api/review")){
            return true;
        }

        // Assignment endpoints - all authenticated users
        if (path.startsWith("/api/assignments")) {
            return true; // All can manage their assignments
        }
        //Admin endpoints
        if(path.startsWith("/api/admin")){
            return "ADMIN".equalsIgnoreCase(role);
        }
        if(path.startsWith("/api/review/postReview")){
            return "EMPLOYER".equalsIgnoreCase(role);
        }
        if(path.startsWith("/api/review/getReview/**")){
            return "ADMIN".equalsIgnoreCase(role);
        }
        if(path.startsWith("/api/analysis/**")){
            return "ADMIN".equalsIgnoreCase(role);
        }

        // Default: allow access (additional fine-grained checks in services)
        return true;
    }


    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add("Content-Type", "application/json");
        
        String errorResponse = String.format(
            "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"message\":\"%s\",\"path\":\"%s\"}",
            java.time.LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            exchange.getRequest().getURI().getPath()
        );
        
        return response.writeWith(Mono.just(response.bufferFactory().wrap(errorResponse.getBytes())));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 4;
    }
}
