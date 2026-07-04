package com.GramWork.Attendence.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceResponse {
    private String AttendanceID;
    private String EmployerID;
    private String JobID;
    private LocalDate WorkDate;
    private List<String> Workers;
    private java.util.HashMap<String, LocalDateTime> WorkerWithPresentDate;
}
