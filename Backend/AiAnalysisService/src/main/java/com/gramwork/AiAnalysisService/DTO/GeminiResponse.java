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
public class GeminiResponse {

    private String sentiment;

    private Double confidence;

    private String summary;

    private List<String> keywords;

    private Boolean spam;

    private Boolean toxic;
}