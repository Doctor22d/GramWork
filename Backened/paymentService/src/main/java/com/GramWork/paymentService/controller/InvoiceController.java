package com.GramWork.paymentService.controller;

import com.GramWork.paymentService.DTO.InvoiceRequest;
import com.GramWork.paymentService.DTO.InvoiceResponse;
import com.GramWork.paymentService.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService service;
    @PostMapping("/createInvoice")
    public ResponseEntity<?> createInvoice(@RequestBody InvoiceRequest request){
        try{
            InvoiceResponse response=service.createInvoice(request);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<?> generatePdf(@PathVariable("id") String id) {
        try {
            byte[] pdfBytes = service.generatePdfInvoice(id);
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "invoice-" + id + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating PDF: " + e.getMessage());
        }
    }

}
