package com.gramwork.AiAnalysisService.repository;

import com.gramwork.AiAnalysisService.model.WorkerInsight;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkerInsightRepository extends MongoRepository<WorkerInsight,String> {
    Optional<WorkerInsight> findByWorkerId(String workerID);
}
