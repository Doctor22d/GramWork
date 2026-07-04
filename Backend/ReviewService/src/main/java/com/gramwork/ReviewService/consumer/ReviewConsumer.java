package com.gramwork.ReviewService.consumer;

import com.gramwork.ReviewService.config.RabbitMQConfig;
import com.gramwork.ReviewService.model.Review;
import com.gramwork.ReviewService.model.Status;
import com.gramwork.ReviewService.repository.AssignmentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewConsumer {

    private final AssignmentRepo repo;

    @RabbitListener(queues = RabbitMQConfig.DELETE_QUEUE)
    public void consumeDeleteReviewEvent(String reviewId) {
        if (reviewId != null && !reviewId.isEmpty()) {
            repo.deleteById(reviewId);
        }
    }
    @RabbitListener(queues = RabbitMQConfig.Check_Review_QUEUE)
    public void consumeCheckReviewEvent(String reviewId){
        if(reviewId != null && !reviewId.isEmpty()){
            Review review=repo.findById(reviewId)
                    .orElseThrow(()-> new RuntimeException("Review not found"));
            review.setStatus(Status.APPROVED);
            repo.save(review);
        }
    }
}
