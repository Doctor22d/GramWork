package com.gramWork.AiMatchingService.Service;

import com.gramWork.AiMatchingService.Client.JobClient;
import com.gramWork.AiMatchingService.Client.UserClient;
import com.gramWork.AiMatchingService.DTO.JobDTO;
import com.gramWork.AiMatchingService.DTO.MatchingScoreResponse;
import com.gramWork.AiMatchingService.DTO.WorkerProfile;
import com.gramWork.AiMatchingService.DTO.nearbyRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingServiceImp implements MatchingService {
    private final JobClient jobClient;
    private final UserClient userClient;

    private static final Map<String, Double> WEIGHTS = Map.of(
        "distance",    0.30,
        "skillMatch",  0.25,
        "wage",        0.15,
        "availability",0.10,
        "rating",      0.10,
        "reliability", 0.10
    );

    @Override
    public List<MatchingScoreResponse> findTopMatches(String jobId, int limit) {
        JobDTO job = jobClient.getJob(jobId);
        
        if (job == null || job.getLatitude() == null || job.getLongitude() == null) {
            return new ArrayList<>();
        }

        List<WorkerProfile> nearbyWorkers = userClient.getNearbyWorker(job.getLatitude(), job.getLongitude());
        
        if (nearbyWorkers == null || nearbyWorkers.isEmpty()) {
            return new ArrayList<>();
        }

        return nearbyWorkers.stream()
            .map(w -> calculateScore(w, job))
            .filter(m -> m.getTotalScore() > 0)
            .sorted(Comparator.comparingDouble(MatchingScoreResponse::getTotalScore).reversed())
            .limit(limit)
            .collect(Collectors.toList());
    }



    private MatchingScoreResponse calculateScore(WorkerProfile worker, JobDTO job) {
        double distScore   = calculateDistanceScore(worker, job);
        double skillScore  = calculateSkillScore(worker.getSkills(), job.getRequiredSkills());
        double wageScore   = calculateWageScore(worker.getDailyWage(), job.getDailyWages());

        if ("UNAVAILABLE".equalsIgnoreCase(worker.getAvailability())) {
            return MatchingScoreResponse.builder().totalScore(0.0).build();
        }
        double availScore  = "AVAILABLE".equalsIgnoreCase(worker.getAvailability()) ? 1.0 : 0.3;
        if (worker.getAvailability() == null) availScore = 1.0; // Default to AVAILABLE if missing
        
        double ratingScore = calculateRatingScore(worker.getRating());
        double relScore    = calculateReliabilityScore(worker.getReliabilityScore());

        double total = (distScore * WEIGHTS.get("distance")) 
                     + (skillScore * WEIGHTS.get("skillMatch")) 
                     + (wageScore * WEIGHTS.get("wage"))
                     + (availScore * WEIGHTS.get("availability")) 
                     + (ratingScore * WEIGHTS.get("rating")) 
                     + (relScore * WEIGHTS.get("reliability"));

        double finalScore = Math.round(total * 10000.0) / 100.0;

        return MatchingScoreResponse.builder()
                .userId(worker.getUserId())
                .workerSkills(worker.getSkills())
                .distanceScore(distScore)
                .skillScore(skillScore)
                .wageScore(wageScore)
                .availabilityScore(availScore)
                .ratingScore(ratingScore)
                .reliabilityScore(relScore)
                .totalScore(finalScore)
                .build();
    }

    private double calculateDistanceScore(WorkerProfile worker, JobDTO job) {
        if (worker.getLatitude() == null || worker.getLongitude() == null) return 0.5;
        
        double R = 6371;
        double dLat = Math.toRadians(job.getLatitude() - worker.getLatitude());
        double dLon = Math.toRadians(job.getLongitude() - worker.getLongitude());
        double lat1 = Math.toRadians(worker.getLatitude());
        double lat2 = Math.toRadians(job.getLatitude());

        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        double distance = R * c;
        
        double maxRadius = 50.0;
        return Math.max(0, 1 - (distance / maxRadius));
    }

    private double calculateSkillScore(String workerSkillsStr, String requiredSkillsStr) {
        Set<String> requiredSkills = parseSkills(requiredSkillsStr);
        Set<String> workerSkills = parseSkills(workerSkillsStr);
        
        if (requiredSkills.isEmpty()) return 1.0;
        if (workerSkills.isEmpty()) return 0.0;
        
        Set<String> intersection = requiredSkills.stream()
                .filter(workerSkills::contains)
                .collect(Collectors.toSet());
                

        return (double) intersection.size() / requiredSkills.size();
    }

    private double calculateWageScore(Double workerWage, Double jobWage) {
        if (jobWage == null) return 1.0;
        if (workerWage == null) return 1.0;
        
        if (workerWage <= jobWage) return 1.0;
        return Math.max(0, 1.0 - ((workerWage - jobWage) / jobWage));
    }

    private double calculateRatingScore(Double rating) {
        if (rating == null) return 0.5;
        return Math.max(0.0, Math.min(1.0, (rating - 1) / 4.0));
    }

    private double calculateReliabilityScore(Double reliability) {
        if (reliability == null) return 0.5; // Neutral
        return reliability;
    }

    private Set<String> parseSkills(String skillsStr) {
        if (skillsStr == null || skillsStr.trim().isEmpty()) {
            return Set.of();
        }
        return Arrays.stream(skillsStr.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }
}
