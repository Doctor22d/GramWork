package com.GramWork.Assignment_Service.Controller;

import com.GramWork.Assignment_Service.DTO.*;
import com.GramWork.Assignment_Service.Service.AssigmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssigmentService assignmentService;
    @PostMapping("/createAssignment")
    public ResponseEntity<responseAssig> createAssignment(@Valid @RequestBody requestAssig requestAssig){
        responseAssig responseAssig=assignmentService.createAssignment(requestAssig);
        return new ResponseEntity<>(responseAssig,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<responseAssig> getAssignmentById(@PathVariable("id") String id) {
        responseAssig response = assignmentService.getAssignmentById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptAssignment(@PathVariable("id") String id,@RequestBody AvailabilityRequest request) {
        responseAssig res = assignmentService.acceptAssignment(id,request);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectAssignment(@PathVariable("id") String id) {
        responseAssig res = assignmentService.rejectAssignment(id);
        return ResponseEntity.ok(res);
    }


    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeAssignment(@PathVariable("id") String id,@RequestBody AvailabilityRequest request) {
        responseAssig res = assignmentService.completeAssignment(id,request);
        return ResponseEntity.ok(res);
    }
    @PutMapping("/processPayment")
    public ResponseEntity<?> processPayment(@RequestBody CompleteRequest request) {
        try {
            assignmentService.processPayment(request);
            return ResponseEntity.ok("Payment processed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/employer-complete/{employerId}")
    public ResponseEntity<responseAssig> employerCompleteAssignment(
            @PathVariable("id") String id,
            @PathVariable("employerId") String employerId) {
        responseAssig res = assignmentService.employerCompleteAssignment(id, employerId);
        return ResponseEntity.ok(res);
    }


}
