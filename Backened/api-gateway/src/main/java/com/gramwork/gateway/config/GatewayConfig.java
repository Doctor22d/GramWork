package com.gramwork.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
/**
 * Gateway Route Configuration
 * Defines all routes and their configurations programmatically.
 * Routes match the actual controller @RequestMapping paths used by each microservice.
 */
@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()

            // ===== Auth Service =====
            // Controller: @RequestMapping("/api/auth")
            .route("auth-service", r -> r
                .path("/api/auth/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("authService")
                        .setFallbackUri("forward:/fallback/auth"))
                    .retry(config -> config
                        .setRetries(3)))
                .uri("lb://AUTH"))

            // ===== Profile Service (laborer-profile) =====
            // Controller: @RequestMapping("/api/worker")
            .route("worker-service", r -> r
                .path("/api/worker/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("laborerProfileService")
                        .setFallbackUri("forward:/fallback/profile")))
                .uri("lb://laborer-profile"))

            // Controller: @RequestMapping("/api/employer")
            .route("employer-service", r -> r
                .path("/api/employer/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("employerProfileService")
                        .setFallbackUri("forward:/fallback/profile")))
                .uri("lb://laborer-profile"))

            // Controller: @RequestMapping("/api/admin")
            .route("admin-service", r -> r
                .path("/api/admin/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("laborerProfileService")
                        .setFallbackUri("forward:/fallback/profile")))
                .uri("lb://laborer-profile"))


            .route("job-service", r -> r
                .path("/api/job/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("jobService")
                        .setFallbackUri("forward:/fallback/job")))
                .uri("lb://Job"))


            .route("assignment-service", r -> r
                .path("/api/assignments/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("assignmentService")
                        .setFallbackUri("forward:/fallback/assignment")))
                .uri("lb://Assignment-Service"))


            .route("payment-service", r -> r
                .path("/api/payment/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("paymentService")
                        .setFallbackUri("forward:/fallback/payment")))
                .uri("lb://paymentService"))


            .route("invoice-service", r -> r
                .path("/api/invoice/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("paymentService")
                        .setFallbackUri("forward:/fallback/payment")))
                .uri("lb://paymentService"))

            // ===== Notification Service =====
            // Controller: @RequestMapping("/api/notifications")
            .route("notification-service", r -> r
                .path("/api/notifications/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("notificationService")
                        .setFallbackUri("forward:/fallback/notification")))
                .uri("lb://NotificationService"))

            // ===== Attendance Service =====
            // Controller: @RequestMapping("/api/attendance")
            .route("attendance-service", r -> r
                .path("/api/attendance/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("attendanceService")
                        .setFallbackUri("forward:/fallback/attendance")))
                .uri("lb://Attendence"))

            // ===== AI Matching Service =====
            // Controller: @RequestMapping("/api/Matching")
            .route("ai-matching-service", r -> r
                .path("/api/Matching/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("aiMatchingService")
                        .setFallbackUri("forward:/fallback/matching")))
                .uri("lb://aimatchingservice"))
                .route("Review-Service",r-> r.
                        path("/api/review/**")
                        .filters(f-> f
                                .circuitBreaker(config -> config
                                        .setName("ReviewService")
                                        .setFallbackUri("forward:/fallback/review")))
                        .uri("lb://review-service"))

            // ===== Swagger/API Docs Routes =====
            .route("auth-service-docs", r -> r.path("/v3/api-docs/auth-service")
                .filters(f -> f.rewritePath("/v3/api-docs/auth-service", "/v3/api-docs"))
                .uri("lb://AUTH"))
            .route("laborer-profile-service-docs", r -> r.path("/v3/api-docs/laborer-profile-service")
                .filters(f -> f.rewritePath("/v3/api-docs/laborer-profile-service", "/v3/api-docs"))
                .uri("lb://laborer-profile"))
            .route("job-service-docs", r -> r.path("/v3/api-docs/job-service")
                .filters(f -> f.rewritePath("/v3/api-docs/job-service", "/v3/api-docs"))
                .uri("lb://Job"))
            .route("assignment-service-docs", r -> r.path("/v3/api-docs/assignment-service")
                .filters(f -> f.rewritePath("/v3/api-docs/assignment-service", "/v3/api-docs"))
                .uri("lb://Assignment-Service"))
            .route("payment-service-docs", r -> r.path("/v3/api-docs/payment-service")
                .filters(f -> f.rewritePath("/v3/api-docs/payment-service", "/v3/api-docs"))
                .uri("lb://paymentService"))
            .route("notification-service-docs", r -> r.path("/v3/api-docs/notification-service")
                .filters(f -> f.rewritePath("/v3/api-docs/notification-service", "/v3/api-docs"))
                .uri("lb://NotificationService"))
            .route("attendance-service-docs", r -> r.path("/v3/api-docs/attendance-service")
                .filters(f -> f.rewritePath("/v3/api-docs/attendance-service", "/v3/api-docs"))
                .uri("lb://Attendence"))
            .route("ai-matching-service-docs", r -> r.path("/v3/api-docs/ai-matching-service")
                .filters(f -> f.rewritePath("/v3/api-docs/ai-matching-service", "/v3/api-docs"))
                .uri("lb://aimatchingservice"))

            .build();
    }
}
