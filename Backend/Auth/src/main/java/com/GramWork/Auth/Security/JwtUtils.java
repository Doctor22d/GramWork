package com.GramWork.Auth.Security;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtils {
    @Value("${jwt.secret}")
    private String jwtSecret;

    public SecretKey secretKey(){
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    public String generateToken(String userId, String roles) {
        return Jwts.builder()
                .subject(userId)
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1800000))
                .signWith(secretKey())
                .compact();
    }
    public String extractSubject(String jwtToken){
        try{
            return Jwts.parser()
                    .verifyWith(secretKey())
                    .build()
                    .parseSignedClaims(jwtToken)
                    .getPayload()
                    .getSubject();
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }
    public List<SimpleGrantedAuthority> extractRoles(String jwtToken){
        try{
            Claims claims=Jwts.parser()
                    .verifyWith(secretKey())
                    .build()
                    .parseSignedClaims(jwtToken)
                    .getPayload();
            Object rolesObj=claims.get("roles");
            if(rolesObj instanceof String roles){
                String prefixed=roles.startsWith("ROLE_") ? roles:"ROLE_"+roles;
                return List.of(new SimpleGrantedAuthority(prefixed));
            }
            if (rolesObj instanceof List<?> roleList) {
                return roleList.stream()
                        .map(r -> {
                            String role = r.toString();
                            return new SimpleGrantedAuthority(
                                    role.startsWith("ROLE_") ? role : "ROLE_" + role
                            );
                        })
                        .toList();
            }
            return List.of();
        }catch (Exception e){
            return List.of();
        }
    }
}
