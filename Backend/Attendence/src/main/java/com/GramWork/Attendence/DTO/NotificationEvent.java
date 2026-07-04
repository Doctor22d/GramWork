package com.GramWork.Attendence.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private String recipientID;
    private String body;
    private String subject;
    private boolean isRead;
    private Map<String,Object> metadata;
    private String category;
}
