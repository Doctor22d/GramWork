package com.gramwork.AiAnalysisService.controller;

import com.gramwork.AiAnalysisService.DTO.AIAnalysisResponse;
import com.gramwork.AiAnalysisService.DTO.WorkerInsightResponse;
import com.gramwork.AiAnalysisService.service.AiAnalysisService;
import com.gramwork.AiAnalysisService.service.WorkerInsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AIController {
    private final AiAnalysisService analysisService;
    private final WorkerInsightService insightService;
    @GetMapping("/{reviewID}")
    public ResponseEntity<?> getReviewAnalysis(@PathVariable String reviewID){
        try {
            AIAnalysisResponse response=analysisService.getReview(reviewID);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
    @GetMapping("/worker/{workerId}")
    public ResponseEntity<?> getWorkerInsight(@PathVariable String workerId){
        try{
            WorkerInsightResponse response =insightService.getWorker(workerId);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/reanalysis/{reviewId}")
    public ResponseEntity<?> analysisReview(@PathVariable String reviewId){
        try {
            AIAnalysisResponse response=analysisService.reanalysis(reviewId);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
