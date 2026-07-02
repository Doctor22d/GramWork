package com.gramwork.ReviewService.service;

import com.gramwork.ReviewService.DTO.ReviewRequest;

import java.util.List;

public interface ReviewService {
    String postReview(ReviewRequest reviewRequest,String assignmentID);

    List<com.gramwork.ReviewService.model.Review> getReviewsByReviewerId(String reviewerId);
}
