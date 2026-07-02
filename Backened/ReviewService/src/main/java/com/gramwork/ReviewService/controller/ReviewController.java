package com.gramwork.ReviewService.controller;

import com.gramwork.ReviewService.DTO.ReviewRequest;
import com.gramwork.ReviewService.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;
    @PostMapping("/postReview/{assignmentID}")
    public ResponseEntity<String> postReview(@PathVariable String assignmentID,
                                              @RequestBody ReviewRequest reviewRequest){
        try{
            String message= service.postReview(reviewRequest,assignmentID);
            return ResponseEntity.ok(message);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/getReview/{reviewUserID}")
    public ResponseEntity<?> getReviewsByReviewer(@PathVariable String reviewerUserID){
        try {
            List<com.gramwork.ReviewService.model.Review> reviews = service.getReviewsByReviewerId(reviewerUserID);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
