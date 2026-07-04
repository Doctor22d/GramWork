package com.GramWork.Assignment_Service.Client;

import com.GramWork.Assignment_Service.DTO.JobDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        url = "http://localhost:8082",
        name = "Job-service"
)
public interface JobClient {
    @GetMapping("/api/job/{id}/checkJobID")
    boolean checkJobID(@PathVariable("id") String id);
    @GetMapping("/api/job/{id}")
    JobDTO getJobById(@PathVariable("id") String id);
    @PutMapping("/api/job/{jobId}/hired-workers")
    void updateHireWorkers(
            @PathVariable("jobId") String jobId,
            @RequestParam("count") int count
    );
}
