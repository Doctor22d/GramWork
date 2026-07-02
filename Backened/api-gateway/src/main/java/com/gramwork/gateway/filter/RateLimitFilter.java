package com.gramwork.gateway.filter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;

/**
 * Rate Limiting Filter
 * Implements token bucket algorithm using Redis for distributed rate limiting
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter implements GlobalFilter, Ordered {

    private final ReactiveRedisTemplate<String, String> redisTemplate;

    private static final int MAX_REQUESTS_PER_MINUTE = 100;
    private static final String RATE_LIMIT_KEY_PREFIX = "rate_limit:";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // Get client identifier (IP address or user ID)
        String clientId = getClientId(request);
        String key = RATE_LIMIT_KEY_PREFIX + clientId;

        return redisTemplate.opsForValue()
                .increment(key)
                .flatMap(count -> {
                    // Set expiration on first request
                    if (count == 1) {
                        redisTemplate.expire(key, Duration.ofMinutes(1)).subscribe();
                    }

                    // Check if rate limit exceeded
                    if (count > MAX_REQUESTS_PER_MINUTE) {
                        log.warn("Rate limit exceeded for client: {} - Count: {}", clientId, count);
                        exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                        exchange.getResponse().getHeaders().add("X-Rate-Limit-Retry-After-Seconds", "60");
                        return exchange.getResponse().setComplete();
                    }

                    // Add rate limit headers
                    exchange.getResponse().getHeaders().add("X-Rate-Limit-Limit", String.valueOf(MAX_REQUESTS_PER_MINUTE));
                    exchange.getResponse().getHeaders().add("X-Rate-Limit-Remaining", String.valueOf(MAX_REQUESTS_PER_MINUTE - count));

                    return chain.filter(exchange);
                })
                .onErrorResume(e -> {
                    log.error("Error in rate limiting: {}", e.getMessage());
                    // Continue without rate limiting on error
                    return chain.filter(exchange);
                });
    }

    private String getClientId(ServerHttpRequest request) {
        // Try to get user ID from header (set by JWT filter)
        String userId = request.getHeaders().getFirst("X-User-Id");
        if (userId != null && !userId.isEmpty()) {
            return "user:" + userId;
        }

        // Fall back to IP address
        String remoteAddress = request.getRemoteAddress() != null
                ? request.getRemoteAddress().getAddress().getHostAddress()
                : "unknown";
        return "ip:" + remoteAddress;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 2;
    }
}
