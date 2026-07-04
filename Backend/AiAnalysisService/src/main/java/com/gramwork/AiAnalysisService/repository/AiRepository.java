package com.gramwork.AiAnalysisService.repository;

import com.gramwork.AiAnalysisService.model.ReviewAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiRepository extends MongoRepository<ReviewAnalysis,String> {
    List<ReviewAnalysis> findByWorkerId(String workerID);
    Optional<ReviewAnalysis> findByReviewId(String reviewId);
}
