package com.GramWork.laborer.profile.Config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // ── Notification (publish only – consumed by NotificationService) ──
    @Value("${rabbitmq.exchange.notification}")
    private String notificationExchange;

    @Value("${rabbitmq.routing-key.notification}")
    private String notificationRoutingKey;

    // ── Profile-delete wait queue (TTL → DLX) ──
    @Value("${rabbitmq.exchange.profile-delete-wait}")
    private String profileDeleteWaitExchange;

    @Value("${rabbitmq.queue.profile-delete-wait}")
    private String profileDeleteWaitQueue;

    @Value("${rabbitmq.routing-key.profile-delete-wait}")
    private String profileDeleteWaitRoutingKey;

    // ── Profile-delete actual queue (consumer listens here) ──
    @Value("${rabbitmq.exchange.profile-delete}")
    private String profileDeleteExchange;

    @Value("${rabbitmq.queue.profile-delete}")
    private String profileDeleteQueue;

    @Value("${rabbitmq.routing-key.profile-delete}")
    private String profileDeleteRoutingKey;

    // TTL in milliseconds – default 24 hours
    @Value("${profile.delete.ttl}")
    private long profileDeleteTtl;

    // ───────────────── Exchanges ─────────────────

    @Bean
    public DirectExchange notificationExchange() {
        return new DirectExchange(notificationExchange);
    }

    @Bean
    public DirectExchange profileDeleteWaitExchange() {
        return new DirectExchange(profileDeleteWaitExchange);
    }

    @Bean
    public DirectExchange profileDeleteExchange() {
        return new DirectExchange(profileDeleteExchange);
    }

    // ───────────────── Queues ─────────────────

    /**
     * Wait queue with TTL. Messages sit here for 24 hours,
     * then dead-letter into profile.delete.exchange → profile.delete.queue.
     */
    @Bean
    public Queue profileDeleteWaitQueue() {
        return QueueBuilder.durable(profileDeleteWaitQueue)
                .withArgument("x-message-ttl", profileDeleteTtl)
                .withArgument("x-dead-letter-exchange", profileDeleteExchange)
                .withArgument("x-dead-letter-routing-key", profileDeleteRoutingKey)
                .build();
    }

    /** Actual queue where the ProfileDeleteConsumer listens. */
    @Bean
    public Queue profileDeleteQueue() {
        return QueueBuilder.durable(profileDeleteQueue).build();
    }

    // ───────────────── Bindings ─────────────────

    @Bean
    public Binding profileDeleteWaitBinding() {
        return BindingBuilder.bind(profileDeleteWaitQueue())
                .to(profileDeleteWaitExchange())
                .with(profileDeleteWaitRoutingKey);
    }

    @Bean
    public Binding profileDeleteBinding() {
        return BindingBuilder.bind(profileDeleteQueue())
                .to(profileDeleteExchange())
                .with(profileDeleteRoutingKey);
    }

    // ───────────────── Converter ─────────────────

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
