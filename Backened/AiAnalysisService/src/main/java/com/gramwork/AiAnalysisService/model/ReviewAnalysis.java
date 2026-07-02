package com.gramwork.AiAnalysisService.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.N;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="review_analysis")
public class ReviewAnalysis {

    @Id
    private String id;

    private String reviewId;

    private String workerId;

    private int rating;

    private String sentiment;

    private double confidence;

    private String summary;

    private List<String> keywords;

    private boolean spam;

    private boolean toxic;

    private LocalDateTime createdAt;
}