package com.GramWork.laborer.profile.DTO;

import com.GramWork.laborer.profile.model.DocumentType;
import com.GramWork.laborer.profile.model.VerificationStatus;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentResponse {
    private String id;
    private String userID;
    private String fileName;
    private String fileURL;
    private Long fileSize;
    private VerificationStatus status;
    private LocalDateTime uploadDate;
    private DocumentType documentType;
}
