package com.GramWork.Job.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "worker-service",
      url = "http://localhost:8081"
)
public interface EmployerClient {
    @GetMapping("/api/employer/{id}/CheckEmployerID")
    boolean checkEmployerID(@PathVariable("id") String id);
}
