package com.GramWork.Attendence.Service;

import com.GramWork.Attendence.DTO.NotificationEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
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
    public void sendNotification(NotificationEvent event){
        try{
            log.info("Sending In-App Notification event to RabbitMQ for user {}", event.getRecipientID());
            rabbitTemplate.convertAndSend(exchange,routingKey,event);
            log.info("Successfully sent notification event to RabbitMQ for user {}", event.getRecipientID());
        }catch (Exception e){
            log.error("Failed to send In-App Notification event to RabbitMQ for user {}", event.getRecipientID(),e);
            throw e;
        }
    }

}
