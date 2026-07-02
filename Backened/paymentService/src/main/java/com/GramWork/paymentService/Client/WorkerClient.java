package com.GramWork.paymentService.Client;

import com.GramWork.paymentService.DTO.WorkerProfile;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        url = "http://localhost:8081",
        name = "Worker-service"
)
public interface WorkerClient {
    @GetMapping("/api/worker/get-worker/{id}")
     WorkerProfile getWorkerProfile(@PathVariable("id") String id);
}
