package com.gramwork.AiAnalysisService.service;

import com.gramwork.AiAnalysisService.DTO.GeminiResponse;

public interface GeminiService {
    GeminiResponse analyze(String review);
}
