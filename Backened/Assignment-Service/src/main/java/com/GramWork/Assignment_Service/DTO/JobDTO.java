package com.GramWork.Assignment_Service.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobDTO {
    private String jobId;
    private String employerId;
    private String employerName;
    private String title;
    private Double wage;
    private Integer requiredWorkers;
    private Integer hiredWorkers;
}
