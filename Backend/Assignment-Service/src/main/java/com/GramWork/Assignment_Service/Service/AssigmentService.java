package com.GramWork.Assignment_Service.Service;

import com.GramWork.Assignment_Service.Client.EmployerClient;
import com.GramWork.Assignment_Service.Client.JobClient;
import com.GramWork.Assignment_Service.Client.WorkerClient;
import com.GramWork.Assignment_Service.DTO.*;
import com.GramWork.Assignment_Service.Repository.AssignmentRepo;
import com.GramWork.Assignment_Service.model.Assignment;
import com.GramWork.Assignment_Service.model.AssignmentStatus;
import com.GramWork.Assignment_Service.model.Availability;
import com.GramWork.Assignment_Service.model.MessageType;
import com.GramWork.Assignment_Service.model.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssigmentService {

    private final AssignmentRepo assignmentRepo;
    private final WorkerClient workerClient;
    private final EmployerClient employerClient;
    private final JobClient jobClient;
    private final AttendanceRemainderProducer producer;
    private final InAppNotificationService inAppNotificationService;

    public responseAssig createAssignment(requestAssig request) {
        String workerId = request.getWorkerId() != null ? request.getWorkerId().trim() : null;
        String employerId = request.getEmployerId() != null ? request.getEmployerId().trim() : null;
        String jobId = request.getJobId() != null ? request.getJobId().trim() : null;

        try {
            if (workerClient.worker(workerId).isEmpty()) {
                throw new RuntimeException("Worker is not valid");
            }
        } catch (Exception e) {
            throw new RuntimeException("Worker check failed: " + e.getMessage());
        }

        try {
            if (!employerClient.employerID(employerId)) {
                throw new RuntimeException("Employer is not valid");
            }
        } catch (Exception e) {
            throw new RuntimeException("Employer check failed: " + e.getMessage());
        }
        JobDTO job = null;
        try {
            job = jobClient.getJobById(jobId);
            if(job==null){
                throw new RuntimeException("Job is not found");
            }
        } catch (Exception e) {
            throw new RuntimeException("Job not found or invalid: " + e.getMessage());
        }

        Double totalWage = request.getTotalWage();
        if (totalWage == null) {
            totalWage = job.getWage();
        }
        List<String> workerList=List.of(request.getWorkerId());

        Assignment assignment = Assignment.builder()
                .jobId(jobId)
                .workerIdList(workerList)
                .employerId(employerId)
                .matchScore(request.getMatchScore() != null ? request.getMatchScore() : 1.0)
                .totalWage(totalWage)
                .status(AssignmentStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .startedDate(request.getStartedDate())
                .completedDate(request.getFinishDate())
                .build();

        Assignment saved = assignmentRepo.save(assignment);
        producer.scheduleReminder(
                assignment.getEmployerId(),
                assignment.getAssignmentId()
        );
        return toResponse(saved);
    }

    public responseAssig acceptAssignment(String id,AvailabilityRequest request) {
        Assignment assignment=assignmentRepo.findById(id).orElseThrow(
                ()-> new RuntimeException("Assignment not found")
        );
        JobDTO job = jobClient.getJobById(assignment.getJobId());
        if(job.getHiredWorkers()>=job.getRequiredWorkers()){
            throw new RuntimeException("Job has been hired");
        }
        List<String> workersList=assignment.getWorkerIdList();
        if(workersList==null){
            workersList=new ArrayList<>();
        }
        List<String> mutableList = new ArrayList<>(workersList);
        if(!mutableList.contains(request.getWorkerId())){
            mutableList.add(request.getWorkerId());
        }
        assignment.setWorkerIdList(mutableList);
        workerClient.updateAvailability(request.getWorkerId(), Availability.UNAVAILABLE);
        jobClient.updateHireWorkers(assignment.getJobId(),
                job.getHiredWorkers()+1);
        assignment.setStatus(AssignmentStatus.ACCEPTED);
        assignment.setStartedDate(LocalDateTime.now());
        Assignment saved = assignmentRepo.save(assignment);
        String message = String.format(
            "<html><body style='font-family: Arial, sans-serif;'>" +
            "<h3 style='color: #2E86C1;'>Worker Accepted Job!</h3>" +
            "<p>Great news! A worker (ID: <strong>%s</strong>) has accepted your assignment for Job ID: <strong>%s</strong>.</p>" +
            "<p><strong>Start Date:</strong> %s</p>" +
            "<p>They will be ready by the scheduled start time.</p>" +
            "</body></html>",
            request.getWorkerId(),
            assignment.getJobId(),
            assignment.getStartedDate()
        );


        return toResponse(saved);
    }


    public responseAssig rejectAssignment(String assignmentId) {
        Assignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));

        if (assignment.getStatus() != AssignmentStatus.PENDING) {
            throw new IllegalStateException("Assignment can only be rejected when status is PENDING. Current: " + assignment.getStatus());
        }

        assignment.setStatus(AssignmentStatus.REJECTED);
        Assignment saved = assignmentRepo.save(assignment);
        return toResponse(saved);
    }

    public responseAssig completeAssignment(String assignmentId,AvailabilityRequest request) {
        Assignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));

        if (assignment.getStatus() != AssignmentStatus.ACCEPTED && assignment.getStatus() != AssignmentStatus.IN_PROGRESS) {
            throw new IllegalStateException("Assignment can only be completed when ACCEPTED or IN_PROGRESS. Current: " + assignment.getStatus());
        }
        assignment.setStatus(AssignmentStatus.PENDING);
        assignment.setCompletedDate(LocalDateTime.now());
        Assignment saved = assignmentRepo.save(assignment);
        workerClient.updateAvailability(request.getWorkerId(),Availability.AVAILABLE);
        workerClient.updateJob(request.getWorkerId());
        return toResponse(saved);
    }

    public responseAssig employerCompleteAssignment(String assignmentId, String employerId) {
        Assignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));

        if (!assignment.getEmployerId().equals(employerId)) {
            throw new RuntimeException("Only the employer who created this assignment can complete it.");
        }
        if(assignment.getPaymentStatus()==PaymentStatus.PENDING){
            throw new RuntimeException("You can't complete this assignment because Payments are pending");
        }

        assignment.setStatus(AssignmentStatus.COMPLETED);
        assignment.setCompletedDate(LocalDateTime.now());
        Assignment saved = assignmentRepo.save(assignment);
        return toResponse(saved);
    }




    public List<responseAssig> getByEmployerId(String employerId) {
        return assignmentRepo.findByEmployerId(employerId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<responseAssig> getByJobId(String jobId) {
        return assignmentRepo.findByJobId(jobId).stream()
                .map(this::toResponse)
                .toList();
    }

    public responseAssig getAssignmentById(String id) {
        Assignment assignment = assignmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + id));
        return toResponse(assignment);
    }

    
    private responseAssig toResponse(Assignment a) {
        return responseAssig.builder()
                .assignmentId(a.getAssignmentId())
                .jobId(a.getJobId())
                .workerIdList(a.getWorkerIdList())
                .employerId(a.getEmployerId())
                .matchScore(a.getMatchScore())
                .totalWage(a.getTotalWage())
                .status(a.getStatus())
                .paymentStatus(a.getPaymentStatus())
                .assignedDate(a.getAssignedDate())
                .startedDate(a.getStartedDate())
                .completedDate(a.getCompletedDate())
                .build();
    }

    public void processPayment(CompleteRequest request) {
        Assignment assignment = assignmentRepo.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        assignment.setTotalWage(request.getTotalWage());

        HashMap<String, String> recordMap = assignment.getPaymentRecords();
        if (recordMap == null) {
            recordMap = new HashMap<>();
        }

        // Add the specific worker's transaction
        if (request.getWorkerId() != null && !request.getWorkerId().isEmpty()) {
            recordMap.put(request.getWorkerId(), request.getTransactionId());
        }

        assignment.setPaymentRecords(recordMap);

        // Check if all workers have been paid
        List<String> workerList = assignment.getWorkerIdList();
        boolean allWorkersPaid = false;
        
        if (workerList != null && !workerList.isEmpty()) {
            allWorkersPaid = recordMap.keySet().containsAll(workerList);
        }

        if (allWorkersPaid) {
            assignment.setPaymentStatus(PaymentStatus.PAID);
        } else {
            // Revert back or keep as PENDING if not everyone is paid
            assignment.setPaymentStatus(PaymentStatus.PENDING);
        }
        
        assignmentRepo.save(assignment);
    }
}
