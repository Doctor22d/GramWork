package com.gramwork.ReviewService.config;

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

    public static final String EXCHANGE = "review-exchange";
    public static final String ROUTING_KEY = "review-created";
    
    public static final String DELETE_QUEUE = "review-delete-queue";
    public static final String DELETE_ROUTING_KEY = "review-deleted";
    public static final String Check_Review_QUEUE="check-review-queue";

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }
    
    @Bean
    public Queue deleteQueue() {
        return new Queue(DELETE_QUEUE);
    }
    
    @Bean
    public Binding deleteBinding() {
        return BindingBuilder.bind(deleteQueue()).to(exchange()).with(DELETE_ROUTING_KEY);
    }

    @Bean
    public Queue checkReviewQueue() {
        return new Queue(Check_Review_QUEUE);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
