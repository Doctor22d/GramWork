package com.gramWork.AiMatchingService.Controller;

import com.gramWork.AiMatchingService.DTO.MatchingScoreResponse;
import com.gramWork.AiMatchingService.Service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Matching")
@RequiredArgsConstructor
public class MatchingController {
    
    private final MatchingService matchingService;

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<MatchingScoreResponse>> findTopMatches(
            @PathVariable String jobId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<MatchingScoreResponse> matchingScore = matchingService.findTopMatches(jobId, limit);
            return ResponseEntity.ok(matchingScore);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
