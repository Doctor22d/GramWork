package com.GramWork.Auth.Service;

import com.GramWork.Auth.DTO.MessageType;
import com.GramWork.Auth.DTO.NotificationEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @Value("${rabbitmq.exchange.notification}")
    private String exchange;
    
    @Value("${rabbitmq.routing-key.notification}")
    private String routingKey;

    @Async
    public void sendEmail(String email, String subject, String message) {
        try {
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("source", "AuthService");
            
            NotificationEvent event = NotificationEvent.builder()
                    .email(email)
                    .subject(subject)
                    .body(message)
                    .messageType(MessageType.EMAIL)
                    .metadata(metadata)
                    .build();
                    
            rabbitTemplate.convertAndSend(exchange, routingKey, event);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email event to RabbitMQ", e);
        }
    }
}
