package com.gramwork.AiAnalysisService.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerInsightResponse {

    private String workerId;

    private Double averageRating;

    private Integer totalReviews;

    private Integer positiveReviews;

    private Integer neutralReviews;

    private Integer negativeReviews;

    private Double trustScore;

    private List<String> topKeywords;

    private String aiSummary;
}