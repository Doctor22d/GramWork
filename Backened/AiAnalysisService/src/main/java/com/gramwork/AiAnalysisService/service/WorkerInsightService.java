package com.gramwork.AiAnalysisService.service;

import com.gramwork.AiAnalysisService.DTO.WorkerInsightResponse;

public interface WorkerInsightService {
    void updateWorkerInsight(String workerID);
    WorkerInsightResponse getWorker(String workerId);
}
