package com.GramWork.Assignment_Service.Client;

import com.GramWork.Assignment_Service.model.Availability;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "worker-service",
        url = "http://localhost:8081"
)
public interface WorkerClient {
    @GetMapping("/api/worker/{id}/checkWorkerID")
    String worker(@PathVariable("id") String id);
    @PutMapping("/api/worker/{id}/availability")
    ResponseEntity<?> updateAvailability(@PathVariable("id") String id,
                                         @RequestBody Availability availability);
    @PutMapping("/api/worker/{id}/updateJobComplete")
    void updateJob(@PathVariable("id") String id);
}
