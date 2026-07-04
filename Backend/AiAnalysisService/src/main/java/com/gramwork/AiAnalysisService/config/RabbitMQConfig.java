package com.gramwork.AiAnalysisService.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {
    public static final String Review_Exchange="review-exchange";
    public static final String Review_Queue="review-queue";
    public static final String Review_routingKey="review-created";
    public static final String Delete_Review_routingKey="review-deleted";
    public static final String Check_Review_routingKey="check-review-created";
    @Bean
    public DirectExchange Review_Exchange(){
        return new DirectExchange(Review_Exchange);
    }
    @Bean
    public Queue Review_Queue(){
        return new Queue(Review_Queue);
    }
    @Bean
    public Binding binding(){
        return BindingBuilder
                .bind(Review_Queue())
                .to(Review_Exchange())
                .with(Review_routingKey);
    }
    @Bean
    public MessageConverter messageConverter(){
        return new Jackson2JsonMessageConverter();
    }
}

