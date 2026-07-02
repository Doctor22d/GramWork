package com.gramwork.ReviewService.producer;

import com.gramwork.ReviewService.config.RabbitMQConfig;
import com.gramwork.ReviewService.event.ReviewCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendReviewCreatedEvent(ReviewCreatedEvent event) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY, event);
    }
}
