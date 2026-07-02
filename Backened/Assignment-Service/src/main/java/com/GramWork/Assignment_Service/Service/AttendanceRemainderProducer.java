package com.GramWork.Assignment_Service.Service;

import com.GramWork.Assignment_Service.DTO.AttendanceRemainderEvent;
import com.GramWork.Assignment_Service.config.RabbitMqConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceRemainderProducer {
    private final RabbitTemplate rabbitTemplate;
    public void scheduleReminder(
            String employerId,
            String assignmentId
    ){
        LocalDateTime now=LocalDateTime.now();
        LocalDateTime reminderTime= LocalDate.now().atTime(19,0);
        if(now.isAfter(reminderTime)){
            reminderTime=reminderTime.plusDays(1);
        }
        Long delay= Duration.between(now,reminderTime)
                .toMillis();
        AttendanceRemainderEvent event= AttendanceRemainderEvent.builder()
                .employerID(employerId)
                .assignmentID(assignmentId).build();
        rabbitTemplate.convertAndSend(RabbitMqConfig.WAIT_EXCHANGE,
                RabbitMqConfig.WAIT_ROUTING_KEY,
                event,
                message -> {
            message.getMessageProperties().setExpiration(String.valueOf(delay));
            return message;
                });
    }
}
