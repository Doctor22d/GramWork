package com.GramWork.paymentService.DTO;

import com.GramWork.paymentService.model.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreatePaymentRequest {
    @NotBlank(message = "assignmentId is required")
    private String assignmentId;

    @NotNull(message = "paymentMethod is required")
    private PaymentMethod paymentMethod;

    @NotBlank(message = "paidBy is required")
    private String paidBy;
    
    @NotBlank(message = "workerId is required")
    private String workerId;
}
