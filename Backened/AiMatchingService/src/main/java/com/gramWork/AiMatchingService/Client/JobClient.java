package com.gramWork.AiMatchingService.Client;

import com.gramWork.AiMatchingService.DTO.JobDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "Job-Service",
        url = "http://localhost:8082"
)
public interface JobClient {
    @GetMapping("/api/job/{JobID}")
    JobDTO getJob(@PathVariable("JobID") String JobID);
}
