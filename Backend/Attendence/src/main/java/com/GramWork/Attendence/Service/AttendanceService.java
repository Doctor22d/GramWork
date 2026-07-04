package com.GramWork.Attendence.Service;

import com.GramWork.Attendence.Client.AssignmentClient;
import com.GramWork.Attendence.DTO.AttendanceResponse;
import com.GramWork.Attendence.DTO.responseAssig;
import com.GramWork.Attendence.Repository.AttendanceRepository;
import com.GramWork.Attendence.model.Attendance;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AssignmentClient assignmentClient;

    public AttendanceResponse create(String AssignmentID) {
        responseAssig response = assignmentClient.getAssignment(AssignmentID);

        Attendance attendance = Attendance.builder()
                .EmployerID(response.getEmployerId())
                .JobID(response.getJobId())
                .WorkDate(LocalDate.from(response.getAssignedDate()))
                .Workers(response.getWorkerIdList())
                .build();

        Attendance saved = attendanceRepository.save(attendance);
        return mapToResponse(saved);
    }


    public List<AttendanceResponse> getByJobId(String jobId) {
        return attendanceRepository.findByJobID(jobId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    public List<AttendanceResponse> getByWorkerId(String workerId) {
        return attendanceRepository.findByWorkers(workerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .AttendanceID(attendance.getId())
                .EmployerID(attendance.getEmployerID())
                .JobID(attendance.getJobID())
                .WorkDate(attendance.getWorkDate())
                .Workers(attendance.getWorkers())
                .WorkerWithPresentDate(attendance.getWorkerWithPresentDate())
                .build();
    }

    public void markAttendance(String AttendanceID, String workerID) {
        Attendance attendance=attendanceRepository.findByStringId(AttendanceID)
                .orElseThrow(
                        ()-> new RuntimeException("attendanceID is not found")
                );
        if(!attendance.getWorkers().contains(workerID)){
            throw new RuntimeException("Worker ID is not found");
        }
        if(attendance.getWorkerWithPresentDate() == null) {
            attendance.setWorkerWithPresentDate(new HashMap<>());
        }
        if(!attendance.getWorkerWithPresentDate().containsKey(workerID)) {
            attendance.getWorkerWithPresentDate().put(workerID, LocalDateTime.now());
            attendanceRepository.save(attendance);
        }
    }

    public boolean isAttendanceMarked(String assignmentID) {
        responseAssig response = assignmentClient.getAssignment(assignmentID);
        return attendanceRepository.findByJobID(response.getJobId()).stream()
                .anyMatch(attendance -> attendance.getWorkDate().isEqual(LocalDate.now()));
    }
}
