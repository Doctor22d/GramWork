package com.gramwork.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Fallback Controller
 * Provides fallback responses when services are unavailable
 */
@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @RequestMapping(
            value = "/auth",
            method = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE
            }
    )
    public ResponseEntity<Map<String, Object>> authFallback() {
        return createFallbackResponse("Auth Service", "Authentication service is temporarily unavailable");
    }

    @RequestMapping(
            value = "/profile",
            method = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE
            }
    )
    public ResponseEntity<Map<String, Object>> profileFallback() {
        return createFallbackResponse("Profile Service", "Profile service is temporarily unavailable");
    }

    @RequestMapping(
            value = "/job",
            method = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE
            }
    )
    public ResponseEntity<Map<String, Object>> jobFallback() {
        return createFallbackResponse("Job Service", "Job service is temporarily unavailable");
    }

    @RequestMapping(
            value = "/assignment",
            method = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE
            }
    )
    public ResponseEntity<Map<String, Object>> assignmentFallback() {
        return createFallbackResponse("Assignment Service", "Assignment service is temporarily unavailable");
    }

    @RequestMapping(
            value = "/payment",
            method = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE
            }
    )
    public ResponseEntity<Map<String, Object>> paymentFallback() {
        return createFallbackResponse("Payment Service", "Payment service is temporarily unavailable");
    }

    @RequestMapping(
            value = "/notification",
            method = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE
            }
    )
    public ResponseEntity<Map<String, Object>> notificationFallback() {
        return createFallbackResponse("Notification Service", "Notification service is temporarily unavailable");
    }

    @RequestMapping(
            value = "/attandance",
            method = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE
            }
    )
    public ResponseEntity<Map<String, Object>> attendanceFallback() {
        return createFallbackResponse("Attendance Service", "Attendance service is temporarily unavailable");
    }

    @RequestMapping(
            value = "/matching",
            method = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE
            }
    )
    public ResponseEntity<Map<String, Object>> matchingFallback() {
        return createFallbackResponse("AI Matching Service", "AI Matching service is temporarily unavailable");
    }
    @RequestMapping(
            value = "/review",
            method = {
                    RequestMethod.GET,
                    RequestMethod.POST,
                    RequestMethod.PUT,
                    RequestMethod.DELETE
            }
    )
    public ResponseEntity<Map<String, Object>> reviewFallback() {
        return createFallbackResponse("Review Service", "Review service is temporarily unavailable");
    }

    private ResponseEntity<Map<String, Object>> createFallbackResponse(String service, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        response.put("error", "Service Unavailable");
        response.put("message", message);
        response.put("service", service);
        response.put("fallback", true);
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}
