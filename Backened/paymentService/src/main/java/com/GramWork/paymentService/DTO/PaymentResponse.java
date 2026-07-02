package com.GramWork.paymentService.DTO;

import com.GramWork.paymentService.model.PaymentMethod;
import com.GramWork.paymentService.model.Status;
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
public class PaymentResponse {
    private String id;
    private String assignmentId;
    private String jobId;
    private List<String> workerIdList;
    private String employerId;
    private Double amount;
    private Status status;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private LocalDateTime paidAt;
    private String paidBy;
}
