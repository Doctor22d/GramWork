package com.GramWork.Assignment_Service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "assignments")
@CompoundIndex(name = "worker_status_idx", def = "{'workerId': 1, 'status': 1}")
public class Assignment {

    @Id
    @org.springframework.data.mongodb.core.mapping.MongoId(org.springframework.data.mongodb.core.mapping.FieldType.OBJECT_ID)
    private String assignmentId;

    @Indexed
    private String jobId;

    @Indexed
    private List<String> workerIdList;

    @Indexed
    private String employerId;

    private Double matchScore;
    private Double totalWage;

    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.PENDING;

    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private HashMap<String,String> PaymentRecords;
    @CreatedDate
    private LocalDateTime assignedDate;

    private LocalDateTime startedDate;
    private LocalDateTime completedDate;
}
