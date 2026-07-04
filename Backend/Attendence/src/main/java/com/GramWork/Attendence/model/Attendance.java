package com.GramWork.Attendence.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Attendance")
public class Attendance {
    @Id
    @org.springframework.data.mongodb.core.mapping.MongoId(org.springframework.data.mongodb.core.mapping.FieldType.STRING)
    private String id;

    @Indexed
    private String EmployerID;
    
    @Indexed
    private String JobID;
    
    private LocalDate WorkDate;

    @Indexed
    private List<String> Workers;

    private HashMap<String,LocalDateTime> WorkerWithPresentDate;

    @CreatedDate
    private LocalDateTime CreateDate;
    @LastModifiedDate
    private LocalDateTime UpdateDate;
}
