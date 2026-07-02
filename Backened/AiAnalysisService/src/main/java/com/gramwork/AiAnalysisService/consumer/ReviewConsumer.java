package com.gramwork.AiAnalysisService.consumer;

import com.gramwork.AiAnalysisService.model.ReviewCreatedEvent;
import com.gramwork.AiAnalysisService.service.AiAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReviewConsumer {
    private final AiAnalysisService analysisService;
    @RabbitListener(queues = "review-queue")
    public void consume(ReviewCreatedEvent event){
        analysisService.analyzeService(event);
    }
}
