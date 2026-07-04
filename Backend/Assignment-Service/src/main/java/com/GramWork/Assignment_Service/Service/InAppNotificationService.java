package com.GramWork.Assignment_Service.Service;

import com.GramWork.Assignment_Service.DTO.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class InAppNotificationService {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.notification}")
    private String exchange;

    @Value("${rabbitmq.routing-key.notification}")
    private String routingKey;

    public void processInAppNotification(NotificationEvent event){
        try{
            log.info("Sending In-App Notification event to RabbitMQ for user {}", event.getRecipientId());
            rabbitTemplate.convertAndSend(exchange, routingKey,
                    event);
            log.info("Successfully sent notification event to RabbitMQ for user {}", event.getRecipientId());
        }catch (Exception e){
            log.error("Failed to send In-App Notification event to RabbitMQ for user {}", event.getRecipientId(), e);
            throw e;
        }
    }
}
