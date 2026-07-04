package com.gramwork.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

/**
 * Trace ID Filter
 * Adds unique correlation ID to each request for distributed tracing
 */
@Slf4j
@Component
public class TraceIdFilter implements GlobalFilter, Ordered {

    private static final String TRACE_ID_HEADER = "X-Trace-Id";
    private static final String CORRELATION_ID_HEADER = "X-Correlation-Id";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        // Generate or extract trace ID
        String traceId = request.getHeaders().getFirst(TRACE_ID_HEADER);
        if (traceId == null || traceId.isEmpty()) {
            traceId = UUID.randomUUID().toString();
        }
        
        // Generate correlation ID
        String correlationId = UUID.randomUUID().toString();
        
        // Add trace and correlation IDs to request headers
        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
            .header(TRACE_ID_HEADER, traceId)
            .header(CORRELATION_ID_HEADER, correlationId)
            .build();
        
        // Add trace ID to response headers
        exchange.getResponse().getHeaders().add(TRACE_ID_HEADER, traceId);
        exchange.getResponse().getHeaders().add(CORRELATION_ID_HEADER, correlationId);
        
        log.debug("Request Trace ID: {}, Correlation ID: {}", traceId, correlationId);
        
        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 1;
    }
}
