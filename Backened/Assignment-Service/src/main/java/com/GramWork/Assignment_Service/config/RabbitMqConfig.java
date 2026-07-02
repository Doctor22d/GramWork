package com.GramWork.Assignment_Service.config;

import org.springframework.amqp.core.CustomExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitMqConfig {
    public static final String WAIT_EXCHANGE = "attendance.wait.exchange";
    public static final String WAIT_ROUTING_KEY = "attendance.wait";
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
