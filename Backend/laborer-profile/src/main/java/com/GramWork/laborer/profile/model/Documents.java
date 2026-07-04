package com.GramWork.laborer.profile.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Documents")
public class Documents {
    @Id
    private String id;
    private String userID;
    private String fileName;
    private Long fileSize;
    private VerificationStatus status;
    private LocalDateTime uploadDate;
    private LocalDateTime verifiedDate;
    private String verifiedBy;
    private String rejectedReason;
    private DocumentType documentType;
    private String key;

}
