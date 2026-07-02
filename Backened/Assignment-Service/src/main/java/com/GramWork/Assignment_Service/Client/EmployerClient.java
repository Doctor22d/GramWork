package com.GramWork.Assignment_Service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "employer-service",
        url = "http://localhost:8081"
)
public interface EmployerClient {
    @GetMapping("/api/employer/{id}/CheckEmployerID")
    boolean employerID(@PathVariable("id") String id);

}
