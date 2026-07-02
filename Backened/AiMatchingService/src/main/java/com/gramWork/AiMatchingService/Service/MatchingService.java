package com.gramWork.AiMatchingService.Service;

import com.gramWork.AiMatchingService.DTO.MatchingScoreResponse;

import java.util.List;

public interface MatchingService {
    List<MatchingScoreResponse> findTopMatches(String jobId, int limit);
}
