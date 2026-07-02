package com.GramWork.Auth.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        log.debug(">>> [JWT Filter] {} {} | Auth header: {}",
                request.getMethod(), request.getRequestURI(),
                authHeader != null ? "present" : "MISSING");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn(">>> [JWT Filter] No Bearer token found — skipping authentication");
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = authHeader.substring(7);
        String subject = jwtUtils.extractSubject(jwtToken);
        log.debug(">>> [JWT Filter] Extracted subject: {}", subject);

        if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            List<SimpleGrantedAuthority> authorities = jwtUtils.extractRoles(jwtToken);
            log.debug(">>> [JWT Filter] Extracted roles/authorities: {}", authorities);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(subject, null, authorities);
            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            log.debug(">>> [JWT Filter] ✅ Authentication set for user: {} with authorities: {}", subject, authorities);
        } else if (subject == null) {
            log.error(">>> [JWT Filter] ❌ Failed to extract subject from token — token may be invalid/expired");
        }

        filterChain.doFilter(request, response);
    }
}
