package com.gramwork.AiAnalysisService.service;

import com.gramwork.AiAnalysisService.DTO.AIAnalysisResponse;
import com.gramwork.AiAnalysisService.model.ReviewCreatedEvent;

public interface AiAnalysisService {
    void analyzeService(ReviewCreatedEvent event);
    AIAnalysisResponse getReview(String reviewId);
    AIAnalysisResponse reanalysis(String reviewId);
}
