package com.gramwork.AiAnalysisService.Producer;

import com.gramwork.AiAnalysisService.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewProducer {
    private final RabbitTemplate rabbitTemplate;
    public void sendReviewCheckEvent(String reviewId){
        rabbitTemplate.convertAndSend(RabbitMQConfig.Check_Review_routingKey);
    }
}
