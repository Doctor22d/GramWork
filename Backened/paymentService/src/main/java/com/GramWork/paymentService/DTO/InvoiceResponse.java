package com.GramWork.paymentService.DTO;

import com.GramWork.paymentService.model.InvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceResponse {
    private String id;
    private String invoiceNumber;
    private String paymentId;
    private String transactionId;
    private String assignmentId;
    private String employerId;
    private String workerId;
    private String jobId;
    private String employerName;
    private String workerName;
    private Double totalAmount;
    private InvoiceStatus invoiceStatus;
    private LocalDateTime generatedDate;
    private LocalDateTime transactionDate;
}
