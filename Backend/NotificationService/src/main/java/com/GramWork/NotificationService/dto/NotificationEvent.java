package com.GramWork.NotificationService.dto;

import com.GramWork.NotificationService.entity.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent implements Serializable {
    private String recipientId;
    private String email;
    private String body;
    private MessageType messageType;
    private String subject;
    private boolean isRead;
    private Map<String, Object> metadata;
    private String category;
    private String actionUrl;
    private String imageUrl;
}
