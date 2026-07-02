package com.GramWork.paymentService.Client;

import com.GramWork.paymentService.DTO.EmployerProfile;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        url = "http://localhost:8081",
        name = "employer-service"
)
public interface EmployerClient {
    @GetMapping("/api/employer/get-employer/{id}")
    EmployerProfile getEmployer(@PathVariable("id") String id);

}
