package com.GramWork.Assignment_Service.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRemainderEvent {
    private String employerID;
    private String assignmentID;
}
