package com.GramWork.paymentService.Client;

import com.GramWork.paymentService.DTO.AssignmentResponse;
import com.GramWork.paymentService.DTO.CompleteRequest;
import com.GramWork.paymentService.DTO.RequestRecord;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        url = "http://localhost:8083",
        name = "Assignment-service"
)
public interface AssignmentClient {

    @GetMapping("/api/assignments/{id}")
    AssignmentResponse getAssignmentById(@PathVariable("id") String id);

    @PutMapping("/api/assignments/processPayment")
    void processPayment(@RequestBody CompleteRequest request);
}
