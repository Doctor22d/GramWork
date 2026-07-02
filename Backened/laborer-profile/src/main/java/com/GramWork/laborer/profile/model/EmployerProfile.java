package com.GramWork.laborer.profile.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "employer_profiles")
public class EmployerProfile {
    @Id   @org.springframework.data.mongodb.core.mapping.MongoId(org.springframework.data.mongodb.core.mapping.FieldType.OBJECT_ID)
    private String employerId;
    private String userID;

    private String employerName;

    @Email(message = "Email is not valid")
    private String employerEmail;
    @Pattern(
            regexp = "[6-9]\\d{9}",
            message = "Invalid Indian phone number"
    )

    private String employerPhone;

    private String aadhaarNumber;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
    private Role role;

}
