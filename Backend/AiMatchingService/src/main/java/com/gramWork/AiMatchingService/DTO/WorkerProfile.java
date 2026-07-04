package com.gramWork.AiMatchingService.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkerProfile {
    private String userId;
    private String skill;
    private Double dailyWage;
    private String availability;
    private Double rating;
    private Double reliabilityScore;
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
    
    public String getSkills() {
        return skill;
    }
}
