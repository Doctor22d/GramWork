package com.GramWork.NotificationService.repository;

import com.GramWork.NotificationService.entity.NotificationEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<NotificationEntity, String> {
    List<NotificationEntity> findByRecipientIdOrderByCreatedAtDesc(String recipientId);
}
