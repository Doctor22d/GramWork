package com.gramWork.AiMatchingService.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchingScoreResponse {
    private String userId;
    private String workerSkills;
    private double totalScore;
    private double distanceScore;
    private double skillScore;
    private double wageScore;
    private double availabilityScore;
    private double ratingScore;
    private double reliabilityScore;
}
