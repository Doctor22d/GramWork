package com.GramWork.NotificationService.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEntity {

    @Id
    private String id;

    @Indexed
    @Field("recipientId")
    private String recipientId;

    @Field("title")
    private String title;

    @Field("message")
    private String message;

    @Field("category")
    private String category;

    @Field("imageUrl")
    private String imageUrl;

    @Field("actionUrl")
    private String actionUrl;

    @Field("metadata")
    private Map<String, Object> metadata;

    @Builder.Default
    @Field("isRead")
    private boolean isRead = false;

    @CreatedDate
    @Field("createdAt")
    private LocalDateTime createdAt;
}
