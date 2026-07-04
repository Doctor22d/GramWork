package com.GramWork.Assignment_Service.DTO;

import com.GramWork.Assignment_Service.model.AssignmentStatus;
import com.GramWork.Assignment_Service.model.PaymentStatus;
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
public class responseAssig {

    private String assignmentId;
    private String jobId;
    private List<String> workerIdList;
    private String employerId;
    private Double matchScore;
    private Double totalWage;
    private AssignmentStatus status;
    private PaymentStatus paymentStatus;
    private LocalDateTime assignedDate;
    private LocalDateTime startedDate;
    private LocalDateTime completedDate;
}
