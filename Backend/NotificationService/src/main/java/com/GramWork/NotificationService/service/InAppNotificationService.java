package com.GramWork.NotificationService.service;

import com.GramWork.NotificationService.dto.NotificationEvent;
import com.GramWork.NotificationService.entity.NotificationEntity;
import com.GramWork.NotificationService.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class InAppNotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public InAppNotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public void processInAppNotification(NotificationEvent event) {
        try {
            // 1. Save to Database
            NotificationEntity entity = NotificationEntity.builder()
                    .recipientId(event.getRecipientId())
                    .title(event.getSubject())
                    .message(event.getBody())
                    .category(event.getCategory())
                    .actionUrl(event.getActionUrl())
                    .imageUrl(event.getImageUrl())
                    .metadata(event.getMetadata())
                    .isRead(false)
                    .build();

            NotificationEntity savedEntity = notificationRepository.save(entity);
            log.info("In-App Notification saved for user {}", event.getRecipientId());

            // 2. Broadcast via WebSocket
            // Send to a specific topic for the user
            messagingTemplate.convertAndSend(
                    "/topic/notifications/" + event.getRecipientId(),
                    savedEntity
            );
            log.info("In-App Notification broadcasted via WebSocket to user {}", event.getRecipientId());

        } catch (Exception e) {
            log.error("Failed to process In-App Notification for user {}", event.getRecipientId(), e);
            throw e; // Trigger DLQ
        }
    }
}
