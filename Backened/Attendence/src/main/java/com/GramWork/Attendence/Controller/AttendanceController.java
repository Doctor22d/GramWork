package com.GramWork.Attendence.Controller;

import com.GramWork.Attendence.DTO.AttendanceResponse;
import com.GramWork.Attendence.Service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/{AssignmentID}/create")
    public ResponseEntity<?> createAttendance(@PathVariable String AssignmentID) {
        try {
            AttendanceResponse response = attendanceService.create(AssignmentID);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/{AttendanceID}/worker/{workerID}/markAttendance")
    public ResponseEntity<?> markAttendance(@PathVariable String AttendanceID,@PathVariable String workerID){
        try{
            attendanceService.markAttendance(AttendanceID,workerID);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<AttendanceResponse>> getByJob(@PathVariable String jobId) {
        List<AttendanceResponse> responses = attendanceService.getByJobId(jobId);
        return ResponseEntity.ok(responses);
    }


    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<AttendanceResponse>> getByWorker(@PathVariable String workerId) {
        List<AttendanceResponse> responses = attendanceService.getByWorkerId(workerId);
        return ResponseEntity.ok(responses);
    }
    @GetMapping("/check/{assignmentID}")
    public ResponseEntity<?> isAttendanceMarked(@PathVariable String assignmentID){
        try{
            boolean res=attendanceService.isAttendanceMarked(assignmentID);
            return new ResponseEntity<>(res,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }
}
