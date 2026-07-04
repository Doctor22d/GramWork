package com.gramwork.AiAnalysisService.service;

import com.gramwork.AiAnalysisService.DTO.AIAnalysisResponse;
import com.gramwork.AiAnalysisService.DTO.GeminiResponse;
import com.gramwork.AiAnalysisService.config.RabbitMQConfig;
import com.gramwork.AiAnalysisService.model.ReviewAnalysis;
import com.gramwork.AiAnalysisService.model.ReviewCreatedEvent;
import com.gramwork.AiAnalysisService.repository.AiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiAnalysisServiceImpl implements AiAnalysisService{
    private final GeminiService geminiService;
    private final AiRepository aiRepository;
    private final WorkerInsightService workerInsight;
    private final RabbitTemplate rabbitTemplate;

    @Override
    public void analyzeService(ReviewCreatedEvent event) {
        GeminiResponse response=geminiService.analyze(event.getComment());
        ReviewAnalysis reviewAnalysis= ReviewAnalysis.builder()
                .reviewId(event.getReviewId())
                .workerId(event.getWorkerId())
                .rating(event.getRating() != null ? event.getRating() : 0)
                .sentiment(response.getSentiment())
                .confidence(response.getConfidence())
                .summary(response.getSummary())
                .keywords(response.getKeywords())
                .spam(response.getSpam())
                .toxic(response.getToxic())
                .build();
        aiRepository.save(reviewAnalysis);
        workerInsight.updateWorkerInsight(event.getWorkerId());
        
        if (Boolean.TRUE.equals(response.getSpam()) || Boolean.TRUE.equals(response.getToxic())) {
            rabbitTemplate.convertAndSend(RabbitMQConfig.Review_Exchange, RabbitMQConfig.Delete_Review_routingKey, event.getReviewId());
        } else {
            rabbitTemplate.convertAndSend(RabbitMQConfig.Review_Exchange, RabbitMQConfig.Check_Review_routingKey, event.getReviewId());
        }
    }

    @Override
    public AIAnalysisResponse getReview(String reviewId) {
        ReviewAnalysis review = aiRepository.findByReviewId(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        return AIAnalysisResponse.builder()
                .reviewId(review.getReviewId())
                .sentiment(review.getSentiment())
                .confidence(review.getConfidence())
                .summary(review.getSummary())
                .keywords(review.getKeywords())
                .spam(review.isSpam())
                .toxic(review.isToxic())
                .build();
    }

    @Override
    public AIAnalysisResponse reanalysis(String reviewId) {
        return getReview(reviewId);
    }
}
