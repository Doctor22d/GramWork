package com.GramWork.NotificationService.config;

import com.rabbitmq.client.AMQP;
import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.exchange.notification}")
    private String notificationExchange;

    @Value("${rabbitmq.exchange.dlx}")
    private String dlxExchange;

    @Value("${rabbitmq.queue.notification}")
    private String notificationQueue;

    @Value("${rabbitmq.queue.dlq}")
    private String dlqQueue;

    @Value("${rabbitmq.routing-key.notification}")
    private String notificationRoutingKey;

    @Value("${rabbitmq.routing-key.dlq}")
    private String dlqRoutingKey;

    @Bean
    public DirectExchange notificationExchange() {
        return new DirectExchange(notificationExchange);
    }

    @Bean
    public DirectExchange dlxExchange() {
        return new DirectExchange(dlxExchange);
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable(notificationQueue)
                .withArgument("x-dead-letter-exchange", dlxExchange)
                .withArgument("x-dead-letter-routing-key", dlqRoutingKey)
                .build();
    }
    @Bean
    public Queue attendanceWaitQueue() {
        return QueueBuilder.durable("attendance.wait.queue")
                .withArgument("x-dead-letter-exchange", notificationExchange)
                .withArgument("x-dead-letter-routing-key", "attendance.remainder")
                .build();
    }

    @Bean
    public DirectExchange waitExchange() {
        return new DirectExchange("attendance.wait.exchange");
    }

    @Bean
    public Binding attendanceWaitBinding() {
        return BindingBuilder.bind(attendanceWaitQueue())
                .to(waitExchange())
                .with("attendance.wait");
    }

    @Bean
    public Queue attendanceQueue(){
        return new Queue("attendance.queue");
    }

    @Bean
    public Binding attendanceBinding() {
        return BindingBuilder.bind(attendanceQueue())
                .to(notificationExchange())
                .with("attendance.remainder");
    }

    @Bean
    public Queue dlqQueue() {
        return QueueBuilder.durable(dlqQueue).build();
    }

    @Bean
    public Binding notificationBinding() {
        return BindingBuilder.bind(notificationQueue())
                .to(notificationExchange())
                .with(notificationRoutingKey);
    }

    @Bean
    public Binding dlqBinding() {
        return BindingBuilder.bind(dlqQueue())
                .to(dlxExchange())
                .with(dlqRoutingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
