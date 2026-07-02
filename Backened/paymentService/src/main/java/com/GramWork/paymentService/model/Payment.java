package com.GramWork.paymentService.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;

    @Indexed(unique = true)
    private String assignmentId;

    @Indexed
    private String jobId;

    @Indexed
    private String employerId;

    @Indexed
    private List<String> workerIdList;

    private HashMap<String,String> CollectionOfPayments;

    private Double amount;
    private Status status;
    private PaymentMethod paymentMethod;
    private String transactionId;

    @CreatedDate
    private LocalDateTime paidAt;

    private String paidBy;
}
