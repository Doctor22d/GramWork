package com.GramWork.paymentService.service;

import com.GramWork.paymentService.Client.AssignmentClient;
import com.GramWork.paymentService.DTO.*;
import com.GramWork.paymentService.exception.PaymentException;
import com.GramWork.paymentService.model.Payment;
import com.GramWork.paymentService.model.PaymentStatus;
import com.GramWork.paymentService.model.Status;
import com.GramWork.paymentService.repository.PaymentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepo paymentRepo;
    private final AssignmentClient assignmentClient;

    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        AssignmentResponse assignment;
        try {
            assignment = assignmentClient.getAssignmentById(request.getAssignmentId());
        } catch (Exception e) {
            throw new PaymentException(
                    "Assignment not found: " + request.getAssignmentId(),
                    HttpStatus.NOT_FOUND
            );
        }


        if (!"COMPLETED".equals(assignment.getStatus())) {
            throw new PaymentException(
                    "Payment can only be created for COMPLETED assignments. Current status: " + assignment.getStatus(),
                    HttpStatus.BAD_REQUEST
            );
        }


        if ("PAID".equals(assignment.getPaymentStatus())) {
            throw new PaymentException(
                    "Assignment " + request.getAssignmentId() + " is already paid",
                    HttpStatus.CONFLICT
            );
        }

        

        if (assignment.getWorkerIdList() == null || !assignment.getWorkerIdList().contains(request.getWorkerId())) {
            throw new PaymentException(
                    "Worker " + request.getWorkerId() + " is not assigned to assignment " + request.getAssignmentId(),
                    HttpStatus.BAD_REQUEST
            );
        }

        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = paymentRepo.findByAssignmentId(request.getAssignmentId()).orElse(null);
        if (payment == null) {
            payment = Payment.builder()
                    .assignmentId(assignment.getAssignmentId())
                    .jobId(assignment.getJobId())
                    .workerIdList(assignment.getWorkerIdList())
                    .employerId(assignment.getEmployerId())
                    .amount(assignment.getTotalWage())
                    .status(Status.PROCESSING)
                    .paymentMethod(request.getPaymentMethod())
                    .transactionId(transactionId) // Store the first transaction ID here
                    .paidBy(request.getPaidBy())
                    .build();
        } else {
            payment.setStatus(Status.PROCESSING);
        }

        HashMap<String, String> payments = payment.getCollectionOfPayments();
        if (payments == null) {
            payments = new HashMap<>();
        }
        
        if (payments.containsKey(request.getWorkerId())) {
            throw new PaymentException(
                    "Payment already exists for worker " + request.getWorkerId(),
                    HttpStatus.CONFLICT
            );
        }

        payments.put(request.getWorkerId(), transactionId);
        payment.setCollectionOfPayments(payments);

        Payment saved = paymentRepo.save(payment);

        try {
            CompleteRequest completeRequest = CompleteRequest.builder()
                    .assignmentId(assignment.getAssignmentId())
                    .totalWage(assignment.getTotalWage())
                    .paymentStatus(PaymentStatus.PAID)
                    .transactionId(transactionId)
                    .workerId(request.getWorkerId())
                    .build();
            assignmentClient.processPayment(completeRequest);
        } catch (Exception e) {
            saved.setStatus(Status.FAILED);
            paymentRepo.save(saved);
            throw new PaymentException(
                    "Payment created but failed to update assignment: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        saved.setStatus(Status.COMPLETED);
        saved = paymentRepo.save(saved);

        return toResponse(saved);
    }
    public PaymentResponse getPaymentById(String paymentId) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new PaymentException(
                        "Payment not found: " + paymentId,
                        HttpStatus.NOT_FOUND
                ));
        return toResponse(payment);
    }


    public PaymentResponse getPaymentByAssignment(String assignmentId) {
        Payment payment = paymentRepo.findByAssignmentId(assignmentId)
                .orElseThrow(() -> new PaymentException(
                        "No payment found for assignment: " + assignmentId,
                        HttpStatus.NOT_FOUND
                ));
        return toResponse(payment);
    }


    public List<PaymentResponse> getPaymentsByWorker(String workerId) {
        List<Payment> payments = paymentRepo.findByWorkerIdListContaining(workerId);
        if (payments.isEmpty()) {
            throw new PaymentException(
                    "No payments found for worker: " + workerId,
                    HttpStatus.NOT_FOUND
            );
        }
        return payments.stream().map(this::toResponse).toList();
    }


    public List<PaymentResponse> getPaymentsByEmployer(String employerId) {
        List<Payment> payments = paymentRepo.findByEmployerId(employerId);
        if (payments.isEmpty()) {
            throw new PaymentException(
                    "No payments found for employer: " + employerId,
                    HttpStatus.NOT_FOUND
            );
        }
        return payments.stream().map(this::toResponse).toList();
    }


    public List<PaymentResponse> getPaymentsByJob(String jobId) {
        List<Payment> payments = paymentRepo.findByJobId(jobId);
        if (payments.isEmpty()) {
            throw new PaymentException(
                    "No payments found for job: " + jobId,
                    HttpStatus.NOT_FOUND
            );
        }
        return payments.stream().map(this::toResponse).toList();
    }


    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .assignmentId(payment.getAssignmentId())
                .jobId(payment.getJobId())
                .workerIdList(payment.getWorkerIdList())
                .employerId(payment.getEmployerId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .paidAt(payment.getPaidAt())
                .paidBy(payment.getPaidBy())
                .build();
    }
}
