package com.gramwork.ReviewService.service;

import com.gramwork.ReviewService.DTO.ReviewRequest;
import com.gramwork.ReviewService.DTO.responseAssig;
import com.gramwork.ReviewService.client.AssignmentClient;
import com.gramwork.ReviewService.event.ReviewCreatedEvent;
import com.gramwork.ReviewService.model.PaymentStatus;
import com.gramwork.ReviewService.model.Review;
import com.gramwork.ReviewService.model.ReviewerType;
import com.gramwork.ReviewService.producer.ReviewProducer;
import com.gramwork.ReviewService.repository.AssignmentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
    private final AssignmentRepo repo;
    private final AssignmentClient client;
    private final ReviewProducer reviewProducer;
    private final StringRedisTemplate redisTemplate;
    
    @Override
    public String postReview(ReviewRequest reviewRequest, String assignmentID) {
        responseAssig response=client.getAssignmentById(assignmentID);
        if(response==null){
            throw new RuntimeException("Assignment not found");
        }
        if(response.getPaymentStatus()== PaymentStatus.PENDING){
            throw new RuntimeException("Payment is not completed");
        }
        
        String reviewerId = response.getEmployerId();
        String suspensionKey = "suspension:reviewer:" + reviewerId;
        String rateKey = "rate:reviewer:" + reviewerId;
        
        if (Boolean.TRUE.equals(redisTemplate.hasKey(suspensionKey))) {
            throw new RuntimeException("You are suspended from reviewing for 24 hours due to spamming.");
        }
        
        Long count = redisTemplate.opsForValue().increment(rateKey);
        if (count != null && count == 1) {
            redisTemplate.expire(rateKey, 1, TimeUnit.MINUTES);
        }
        
        if (count != null && count > 3) {
            redisTemplate.opsForValue().set(suspensionKey, "suspended", 24, TimeUnit.HOURS);
            throw new RuntimeException("You are suspended from reviewing for 24 hours due to spamming.");
        }
        if (repo.existsByAssignmentIDAndReviewerIDAndReviewUserID(
                assignmentID,
                response.getEmployerId(),
                reviewRequest.getReviewUserID())) {
            throw new RuntimeException("Review already submitted for this assignment.");
        }
        if(response.getStatus() != com.gramwork.ReviewService.model.AssignmentStatus.COMPLETED){
            throw new RuntimeException("Assignment is not completed so you can't rating any worker");
        }
        Review review= Review.builder()
                .assignmentID(assignmentID)
                .reviewerID(response.getEmployerId())
                .comment(reviewRequest.getComment())
                .rating(reviewRequest.getRating())
                .reviewDate(LocalDateTime.now())
                .reviewUserID(reviewRequest.getReviewUserID())
                .type(ReviewerType.EMPLOYER)
                .build();
        Review savedReview = repo.save(review);
        
        ReviewCreatedEvent event = ReviewCreatedEvent.builder()
                .reviewId(savedReview.getReviewID())
                .workerId(reviewRequest.getReviewUserID())
                .employerId(response.getEmployerId())
                .rating(reviewRequest.getRating())
                .comment(reviewRequest.getComment())
                .build();
                
        reviewProducer.sendReviewCreatedEvent(event);
        
        return "Thank you for your review";
    }



    @Override
    public List<Review> getReviewsByReviewerId(String reviewerId) {
        return repo.findByReviewUserID(reviewerId);
    }
}
