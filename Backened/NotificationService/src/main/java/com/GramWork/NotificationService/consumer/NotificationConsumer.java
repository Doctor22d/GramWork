package com.GramWork.NotificationService.consumer;

import com.GramWork.NotificationService.dto.NotificationEvent;
import com.GramWork.NotificationService.service.EmailNotificationService;
import com.GramWork.NotificationService.service.InAppNotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationConsumer {

    private final EmailNotificationService emailService;
    private final InAppNotificationService inAppService;

    @Autowired
    public NotificationConsumer(EmailNotificationService emailService, InAppNotificationService inAppService) {
        this.emailService = emailService;
        this.inAppService = inAppService;
    }

    @RabbitListener(queues = "${rabbitmq.queue.notification}")
    public void consumeNotificationEvent(NotificationEvent event) {
        log.info("Received notification event: {}", event);

        try {
            if (event.getMessageType() == null) {
                log.warn("NotificationType is null, skipping event: {}", event);
                return;
            }

            switch (event.getMessageType()) {
                case EMAIL:
                    emailService.processEmailNotification(event);
                    break;
                case IN_APP:
                    inAppService.processInAppNotification(event);
                    break;
                default:
                    log.warn("Unknown NotificationType {}, skipping event: {}", event.getMessageType(), event);
            }
        } catch (Exception e) {
            log.error("Exception occurred while processing notification event: {}. Exception: {}", event, e.getMessage());
            // Rethrow the exception so that Spring AMQP can retry and eventually route to DLQ
            throw e;
        }
    }
}
