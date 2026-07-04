package com.gramwork.ReviewService.client;

import com.gramwork.ReviewService.DTO.responseAssig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        url = "http://localhost:8080",
        name = "Assignment-Service"
)
public interface AssignmentClient {
    @GetMapping("/api/assignments/{id}")
    responseAssig getAssignmentById(@PathVariable String id);
}
