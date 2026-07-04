package com.gramwork.AiAnalysisService.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisRequest {

    @NotBlank
    private String reviewId;

    @NotBlank
    private String workerId;

    @NotBlank
    private String employerId;

    @Min(1)
    @Max(5)
    private Integer rating;

    @NotBlank
    private String comment;
}