package com.GramWork.paymentService.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "Invoice")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Invoice {
    @Id
    private String id;

    @Field("invoiceNumber")
    @Indexed(unique = true)
    private String invoiceNumber;

    @Field("paymentID")
    @Indexed(unique = true)
    private String paymentId;

    @Field("transactionID")
    private String transactionId;

    @Field("assignmentId")
    @Indexed
    private String assignmentId;

    @Field("employerID")
    @Indexed
    private String employerId;

    @Field("WorkerID")
    @Indexed
    private String workerId;

    @Field("jobId")
    private String jobId;
    @Field("EmployerName")
    private String employerName;
    @Field("WorkerName")
    private String workerName;
    private Double totalAmount;

    private InvoiceStatus invoiceStatus;

    @Field("GeneratedDate")
    @CreatedDate
    private LocalDateTime generatedDate;

    @Field("TransactionDate")
    private LocalDateTime transactionDate;

    private String pdfFilePath;
}
