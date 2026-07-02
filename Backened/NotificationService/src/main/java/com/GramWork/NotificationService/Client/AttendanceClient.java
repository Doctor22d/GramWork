package com.GramWork.NotificationService.Client;

import jakarta.annotation.security.PermitAll;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
       name="attendance-service",
        url = "http://localhost:8085"
)
public interface AttendanceClient {
    @GetMapping("/attendance/check/{assignmentId}")
    boolean isAttendanceMarked(@PathVariable String assignmentId);
}
