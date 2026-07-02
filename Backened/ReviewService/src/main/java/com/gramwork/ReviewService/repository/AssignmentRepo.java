package com.gramwork.ReviewService.repository;

import com.gramwork.ReviewService.model.Review;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepo extends MongoRepository<Review,String> {

    boolean existsByAssignmentIDAndReviewerIDAndReviewUserID(String assignmentID, String reviewerID, String reviewUserID);

    List<Review> findByReviewUserID(String reviewerId);
}
