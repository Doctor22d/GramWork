package com.GramWork.paymentService.repository;

import com.GramWork.paymentService.model.Invoice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceRepository extends MongoRepository<Invoice,String> {
    Optional<Invoice> findByPaymentId(String paymentId);
}
