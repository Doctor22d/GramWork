package com.GramWork.Job.controller;

import com.GramWork.Job.DTO.requestJobDB;
import com.GramWork.Job.DTO.responseJobDB;
import com.GramWork.Job.service.EmployerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/job")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService employerService;

    @PostMapping("/postjob")
    public ResponseEntity<?> jobPosting(@Valid @RequestBody requestJobDB requestemployer) {
        responseJobDB res = employerService.posting(requestemployer);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
    @GetMapping("/{id}/checkJobID")
    public ResponseEntity<?> checkJobID(@PathVariable("id") String id){
        boolean res=employerService.checkID(id);
        return ResponseEntity.status(HttpStatus.OK).body(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable("id") String id) {
        com.GramWork.Job.model.JobDB job = employerService.getJobById(id);
        return ResponseEntity.status(HttpStatus.OK).body(job);
    }
    @PutMapping("/{jobId}/hired-workers")
    public ResponseEntity<?> updateHireWorkers(@PathVariable String jobId,
                                               @RequestParam("count") int count){
        try{
            employerService.updateHire(jobId,count);
            return ResponseEntity.status(HttpStatus.OK).body(jobId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
