package com.GramWork.laborer.profile.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class requestAttendance {
    @com.fasterxml.jackson.annotation.JsonProperty("workerID")
    private String workerID;
    @com.fasterxml.jackson.annotation.JsonProperty("attendanceID")
    private String attendanceID;
}
