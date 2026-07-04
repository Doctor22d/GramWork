package com.GramWork.Job.DTO;

import com.GramWork.Job.model.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class responseJobDB {
    private String jobId;

    private String employerId;
    private String employerName;


    private String title;

    private JobStatus status;
}
