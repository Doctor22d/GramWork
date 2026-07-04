package com.GramWork.Assignment_Service.Repository;

import com.GramWork.Assignment_Service.DTO.NotificationEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepo extends MongoRepository<NotificationEvent,String> {
}
