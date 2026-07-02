package com.GramWork.laborer.profile.DTO;

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
    private String subject;
    private String body;
    private String category;
    private boolean isRead;
    private MessageType messageType;
    private String actionUrl;
    private String imageUrl;
    private Map<String, Object> metadata;
}
