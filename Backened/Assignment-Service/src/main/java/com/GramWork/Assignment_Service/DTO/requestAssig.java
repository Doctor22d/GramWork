package com.GramWork.Assignment_Service.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class requestAssig {

    @NotBlank(message = "jobId is required")
    private String jobId;

    @NotBlank(message = "workerId is required")
    private String workerId;

    @NotBlank(message = "employerId is required")
    private String employerId;

    private Double matchScore;
    private Double totalWage;
    private LocalDateTime startedDate;
    private LocalDateTime finishDate;
}
