package com.GramWork.paymentService.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentResponse {
    private String assignmentId;
    private String jobId;
    private List<String> workerIdList;
    private String employerId;
    private Double totalWage;
    private String status;
    private String paymentStatus;
    private LocalDateTime assignedDate;
    private LocalDateTime completedDate;
}
