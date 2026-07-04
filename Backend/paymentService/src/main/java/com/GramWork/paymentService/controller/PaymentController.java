package com.GramWork.paymentService.controller;

import com.GramWork.paymentService.DTO.CreatePaymentRequest;
import com.GramWork.paymentService.DTO.PaymentResponse;
import com.GramWork.paymentService.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        PaymentResponse response = paymentService.createPayment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable("id") String id) {
        PaymentResponse response = paymentService.getPaymentById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<PaymentResponse> getPaymentByAssignment(@PathVariable("assignmentId") String assignmentId) {
        PaymentResponse response = paymentService.getPaymentByAssignment(assignmentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByWorker(@PathVariable("workerId") String workerId) {
        List<PaymentResponse> response = paymentService.getPaymentsByWorker(workerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByEmployer(@PathVariable("employerId") String employerId) {
        List<PaymentResponse> response = paymentService.getPaymentsByEmployer(employerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByJob(@PathVariable("jobId") String jobId) {
        List<PaymentResponse> response = paymentService.getPaymentsByJob(jobId);
        return ResponseEntity.ok(response);
    }
}
