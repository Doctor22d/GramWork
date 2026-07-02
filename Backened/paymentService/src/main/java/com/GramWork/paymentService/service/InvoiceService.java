package com.GramWork.paymentService.service;

import com.GramWork.paymentService.Client.EmployerClient;
import com.GramWork.paymentService.Client.WorkerClient;
import com.GramWork.paymentService.DTO.EmployerProfile;
import com.GramWork.paymentService.DTO.InvoiceRequest;
import com.GramWork.paymentService.DTO.InvoiceResponse;
import com.GramWork.paymentService.DTO.WorkerProfile;
import com.GramWork.paymentService.model.Invoice;
import com.GramWork.paymentService.model.InvoiceStatus;
import com.GramWork.paymentService.model.Payment;
import com.GramWork.paymentService.repository.InvoiceRepository;
import com.GramWork.paymentService.repository.PaymentRepo;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final PaymentRepo paymentRepo;
    private final InvoiceRepository invoiceRepo;
    private final WorkerClient workerClient;
    private final EmployerClient employerClient;

    private static final String INVOICE_DIR = "generated-invoices";

    public InvoiceResponse createInvoice(InvoiceRequest request) {
        Payment payment = paymentRepo.findById(request.getPaymentID())
                .orElseThrow(() -> new RuntimeException("Payment Not Found"));

        if (invoiceRepo.findByPaymentId(payment.getId()).isPresent()) {
            throw new RuntimeException("Invoice already exists for this payment");
        }
        String primaryWorkerId = (payment.getWorkerIdList() != null && !payment.getWorkerIdList().isEmpty()) 
                ? payment.getWorkerIdList().get(0) 
                : null;
        
        WorkerProfile workerProfile=workerClient.getWorkerProfile(primaryWorkerId);
        if(workerProfile==null){
            throw new RuntimeException("Worker Profile Not Found");
        }
        EmployerProfile employerProfile=employerClient.getEmployer(payment.getEmployerId());
        if(employerProfile==null){
            throw new RuntimeException("Employer Not Found");
        }
        
        String invoiceNumber = "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();


        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .paymentId(payment.getId())
                .employerName(employerProfile.getEmployerName())
                .workerName(workerProfile.getWorkerName())
                .transactionId(payment.getTransactionId())
                .assignmentId(payment.getAssignmentId())
                .employerId(payment.getEmployerId())
                .workerId(primaryWorkerId)
                .jobId(payment.getJobId())
                .totalAmount(payment.getAmount())
                .invoiceStatus(InvoiceStatus.PENDING)
                .transactionDate(payment.getPaidAt())
                .build();

        Invoice savedInvoice = invoiceRepo.save(invoice);
        return mapToResponse(savedInvoice);
    }

    public InvoiceResponse getInvoiceByPaymentId(String paymentId) {
        Invoice invoice = invoiceRepo.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Invoice not found for payment: " + paymentId));
        return mapToResponse(invoice);
    }



    public byte[] generatePdfInvoice(String idOrPaymentId) {
        Invoice invoice = invoiceRepo.findById(idOrPaymentId)
                .orElseGet(() -> invoiceRepo.findByPaymentId(idOrPaymentId)
                        .orElseThrow(() -> new RuntimeException("Invoice not found for ID or Payment ID: " + idOrPaymentId)));


        if (invoice.getPdfFilePath() != null) {
            File existingFile = new File(invoice.getPdfFilePath());
            if (existingFile.exists()) {
                try {
                    return Files.readAllBytes(existingFile.toPath());
                } catch (Exception e) {
                }
            }
        }

        if (invoice.getInvoiceNumber() == null) {
            invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        invoice.setGeneratedDate(LocalDateTime.now());
        invoice.setInvoiceStatus(InvoiceStatus.GENERATED);

        try {

            Path dirPath = Paths.get(INVOICE_DIR);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }


            String fileName = invoice.getInvoiceNumber() + ".pdf";
            File pdfFile = dirPath.resolve(fileName).toFile();

            BaseFont baseFont = BaseFont.createFont("C:/Windows/Fonts/arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font titleFont = new Font(baseFont, 20, Font.BOLD);
            Font infoFont = new Font(baseFont, 12, Font.NORMAL);
            Font boldFont = new Font(baseFont, 12, Font.BOLD);
            Font footerFont = new Font(baseFont, 10, Font.ITALIC);

            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
            document.open();


            Paragraph title = new Paragraph("GramWork Invoice", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));


            document.add(new Paragraph("Invoice Number : " + invoice.getInvoiceNumber(), infoFont));
            document.add(new Paragraph("Transaction ID : " + invoice.getTransactionId(), infoFont));
            document.add(new Paragraph("Generated Date : " + invoice.getGeneratedDate(), infoFont));
            document.add(new Paragraph("Transaction Date : " + invoice.getTransactionDate(), infoFont));
            document.add(new Paragraph("Status : " + invoice.getInvoiceStatus(), infoFont));
            document.add(new Paragraph(" "));


            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            PdfPCell headerDesc = new PdfPCell(new Phrase("Description", boldFont));
            PdfPCell headerAmt = new PdfPCell(new Phrase("Amount", boldFont));
            table.addCell(headerDesc);
            table.addCell(headerAmt);

            PdfPCell totalLabel = new PdfPCell(new Phrase("Total Amount", boldFont));
            PdfPCell totalValue = new PdfPCell(new Phrase(formatRupee(invoice.getTotalAmount()), boldFont));
            table.addCell(totalLabel);
            table.addCell(totalValue);

            document.add(table);
            document.add(new Paragraph(" "));


            document.add(new Paragraph("Assignment ID : " + invoice.getAssignmentId(), infoFont));
            document.add(new Paragraph("Job ID : " + invoice.getJobId(), infoFont));
            document.add(new Paragraph("Employer ID : " + invoice.getEmployerId(), infoFont));
            document.add(new Paragraph("Employer Name : " + invoice.getEmployerName(), infoFont));
            document.add(new Paragraph("Worker ID : " + invoice.getWorkerId(), infoFont));
            document.add(new Paragraph("Worker Name : " + invoice.getWorkerName(), infoFont));
            document.add(new Paragraph(" "));


            Paragraph footer = new Paragraph("Thank you for using GramWork!", footerFont);
            footer.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(footer);

            document.close();

            invoice.setPdfFilePath(pdfFile.getAbsolutePath());
            invoiceRepo.save(invoice);

            return Files.readAllBytes(pdfFile.toPath());
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF invoice: " + e.getMessage(), e);
        }
    }

    private String formatRupee(Double amount) {
        if (amount == null) return "\u20B90.00";
        return String.format("\u20B9%.2f", amount);
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .workerName(invoice.getWorkerName())
                .employerName(invoice.getEmployerName())
                .paymentId(invoice.getPaymentId())
                .transactionId(invoice.getTransactionId())
                .assignmentId(invoice.getAssignmentId())
                .employerId(invoice.getEmployerId())
                .workerId(invoice.getWorkerId())
                .jobId(invoice.getJobId())
                .totalAmount(invoice.getTotalAmount())
                .invoiceStatus(invoice.getInvoiceStatus())
                .generatedDate(invoice.getGeneratedDate())
                .transactionDate(invoice.getTransactionDate())
                .build();
    }
}
