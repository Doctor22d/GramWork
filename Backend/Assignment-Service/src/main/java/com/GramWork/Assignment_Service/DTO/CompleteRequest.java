package com.GramWork.Assignment_Service.DTO;

import com.GramWork.Assignment_Service.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompleteRequest {
   private String assignmentId;
   private Double totalWage;
   private PaymentStatus paymentStatus;
   private String transactionId;
   private String workerId;
}
