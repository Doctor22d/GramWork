package com.gramwork.gateway.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User Context Model
 * Represents authenticated user information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserContext {
    
    private String userId;
    private String email;
    private String role;
    private String phoneNumber;
    private boolean verified;
    private boolean active;

    /**
     * Check if user has admin role
     */
    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(role);
    }

    /**
     * Check if user has employer role
     */
    public boolean isEmployer() {
        return "EMPLOYER".equalsIgnoreCase(role);
    }

    /**
     * Check if user has worker/laborer role
     */
    public boolean isWorker() {
        return "WORKER".equalsIgnoreCase(role) || "LABORER".equalsIgnoreCase(role);
    }

    /**
     * Check if user is verified
     */
    public boolean isVerified() {
        return verified;
    }

    /**
     * Check if user is active
     */
    public boolean isActive() {
        return active;
    }
}
