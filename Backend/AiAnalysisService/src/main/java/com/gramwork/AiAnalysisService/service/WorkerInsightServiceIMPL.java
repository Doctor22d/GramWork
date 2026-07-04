package com.gramwork.AiAnalysisService.service;

import com.gramwork.AiAnalysisService.DTO.WorkerInsightResponse;
import com.gramwork.AiAnalysisService.model.ReviewAnalysis;
import com.gramwork.AiAnalysisService.model.WorkerInsight;
import com.gramwork.AiAnalysisService.repository.AiRepository;
import com.gramwork.AiAnalysisService.repository.WorkerInsightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerInsightServiceIMPL implements WorkerInsightService{
    private final WorkerInsightRepository workerInsightRepository;
    private final AiRepository aiRepository;
    @Override
    public void updateWorkerInsight(String workerID) {
        List<ReviewAnalysis> reviews= aiRepository.findByWorkerId(workerID);
        if(reviews.isEmpty()){
            return;
        }
        int totalReview=reviews.size();
        double averageReview=reviews.stream()
                .mapToInt(ReviewAnalysis::getRating)
                .average()
                .orElse(0.0);
        int positive =(int) reviews.stream()
                .filter(r-> "POSITIVE".equalsIgnoreCase(r.getSentiment()))
                .count();
        int neutral=(int) reviews.stream()
                .filter(r-> "NEUTRAL".equalsIgnoreCase(r.getSentiment()))
                .count();
        int negative=(int) reviews.stream()
                .filter(r-> "NEGATIVE".equalsIgnoreCase(r.getSentiment()))
                .count();
        List<String> keywords = reviews.stream()
                .filter(r -> r.getKeywords() != null)
                .flatMap(r -> r.getKeywords().stream())
                .collect(Collectors.groupingBy(k -> k, Collectors.counting()))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(Map.Entry::getKey)
                .toList();
        double trustScore=(averageReview/5.0)*100.0;
        String summary =
                "Worker has " + positive + " positive reviews out of "
                        + totalReview + " total reviews.";
        WorkerInsight insight = workerInsightRepository.findByWorkerId(workerID)
                .orElse(new WorkerInsight());

        insight.setWorkerId(workerID);
        insight.setAverageRating(averageReview);
        insight.setTotalReviews(totalReview);
        insight.setPositiveReviews(positive);
        insight.setNeutralReviews(neutral);
        insight.setNegativeReviews(negative);
        insight.setTopKeywords(keywords);
        insight.setTrustScore(trustScore);
        insight.setAiSummary(summary);

        workerInsightRepository.save(insight);

    }

    @Override
    public WorkerInsightResponse getWorker(String workerId) {
        WorkerInsight insight = workerInsightRepository.findByWorkerId(workerId)
                .orElseThrow(() -> new RuntimeException("Worker insight not found"));
        return WorkerInsightResponse.builder()
                .workerId(insight.getWorkerId())
                .averageRating(insight.getAverageRating())
                .totalReviews(insight.getTotalReviews())
                .positiveReviews(insight.getPositiveReviews())
                .neutralReviews(insight.getNeutralReviews())
                .negativeReviews(insight.getNegativeReviews())
                .trustScore(insight.getTrustScore())
                .topKeywords(insight.getTopKeywords())
                .aiSummary(insight.getAiSummary())
                .build();
    }
}
