package com.GramWork.Attendence.Client;

import com.GramWork.Attendence.DTO.responseAssig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        url = "http://localhost:8083",
        name = "Assignment-Service"
)
public interface AssignmentClient {
    @GetMapping("/api/assignments/{id}")
    responseAssig getAssignment(@PathVariable("id") String id);
}
