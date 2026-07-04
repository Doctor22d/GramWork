package com.gramWork.AiMatchingService.Client;

import com.gramWork.AiMatchingService.DTO.MatchingScoreResponse;
import com.gramWork.AiMatchingService.DTO.WorkerProfile;
import com.gramWork.AiMatchingService.DTO.nearbyRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "Employer-Service",
        url = "http://localhost:8081"
)
public interface UserClient {
    @GetMapping("/api/employer/nearbyWorkerforMatching")
    List<WorkerProfile> getNearbyWorker(@RequestParam("latitude") Double latitude, @RequestParam("longitude") Double longitude);
}
