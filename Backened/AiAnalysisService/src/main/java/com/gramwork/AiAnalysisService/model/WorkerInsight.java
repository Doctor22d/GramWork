package com.gramwork.AiAnalysisService.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "worker_insights")
public class WorkerInsight {

    @Id
    private String id;

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