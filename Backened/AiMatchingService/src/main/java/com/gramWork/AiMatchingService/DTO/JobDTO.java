package com.gramWork.AiMatchingService.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobDTO {
    private String title;
    private String requiredSkills;
    private Double wage;
    private GeoPoint location;

    @Data
    public static class GeoPoint {
        private double x; // longitude
        private double y; // latitude
    }

    public Double getLatitude() {
        return location != null ? location.getY() : null;
    }

    public Double getLongitude() {
        return location != null ? location.getX() : null;
    }

    public Double getDailyWages() {
        return wage;
    }
}
