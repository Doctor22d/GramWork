package com.GramWork.paymentService.repository;

import com.GramWork.paymentService.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepo extends MongoRepository<Payment, String> {

    Optional<Payment> findByAssignmentId(String assignmentId);

    List<Payment> findByWorkerIdListContaining(String workerId);

    List<Payment> findByEmployerId(String employerId);

    List<Payment> findByJobId(String jobId);
}
