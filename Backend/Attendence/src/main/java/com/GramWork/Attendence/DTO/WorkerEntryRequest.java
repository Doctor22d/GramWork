package com.GramWork.Attendence.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkerEntryRequest {
    private String workerId;
    private String assignmentId;
    private String status;         // "PRESENT", "ABSENT", "HALF_DAY"
    private Double wageEarned;
    private String remarks;
}
