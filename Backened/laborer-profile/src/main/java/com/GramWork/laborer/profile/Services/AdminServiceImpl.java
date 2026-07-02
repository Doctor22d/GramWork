package com.GramWork.laborer.profile.Services;

import com.GramWork.laborer.profile.DTO.DocumentResponse;
import com.GramWork.laborer.profile.DTO.MessageType;
import com.GramWork.laborer.profile.DTO.NotificationEvent;
import com.GramWork.laborer.profile.DTO.ProfileDeleteEvent;
import com.GramWork.laborer.profile.Repository.DocumentRepo;
import com.GramWork.laborer.profile.Repository.workerRepository;
import com.GramWork.laborer.profile.model.Documents;
import com.GramWork.laborer.profile.model.VerificationStatus;
import com.GramWork.laborer.profile.model.WorkerProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {
    private final DocumentRepo repo;
    private final S3Service service;
    private final workerRepository workerRepo;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.notification}")
    private String notificationExchange;

    @Value("${rabbitmq.routing-key.notification}")
    private String notificationRoutingKey;

    @Value("${rabbitmq.exchange.profile-delete-wait}")
    private String profileDeleteWaitExchange;

    @Value("${rabbitmq.routing-key.profile-delete-wait}")
    private String profileDeleteWaitRoutingKey;



    @Override
    public List<DocumentResponse> getListDocuments() {
        List<Documents> documentsList =
                repo.findByStatus(VerificationStatus.PENDING);

        return documentsList.stream()
                .map(documents -> DocumentResponse.builder()
                        .id(documents.getId())
                        .documentType(documents.getDocumentType())
                        .fileName(documents.getFileName())
                        .status(documents.getStatus())
                        .fileURL(service.generatePresignedUrl(documents.getKey()))
                        .userID(documents.getUserID())
                        .uploadDate(documents.getUploadDate())
                        .fileSize(documents.getFileSize())
                        .build())
                .toList();
    }



    @Override
    public String acceptDocuments(String id) {
        Documents documents = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Documents not found"));
        if (documents.getStatus() == VerificationStatus.REJECTED) {
            throw new RuntimeException("Document is already rejected");
        }
        if (documents.getStatus() == VerificationStatus.VERIFIED) {
            throw new RuntimeException("Document is already verified");
        }

        documents.setStatus(VerificationStatus.VERIFIED);
        documents.setVerifiedDate(LocalDateTime.now());
        documents.setVerifiedBy("ADMIN");


        WorkerProfile workerProfile = workerRepo.findById(documents.getUserID())
                .orElseThrow(() -> new RuntimeException("Worker is not found"));
        workerProfile.setAadhaarVerified(true);
        workerRepo.save(workerProfile);
        repo.save(documents);


        sendAcceptEmail(workerProfile);

        return "Worker is Verified";
    }



    @Override
    public String rejectDocuments(String id, String reason) {
        Documents documents = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Documents not found"));
        if (documents.getStatus() == VerificationStatus.REJECTED) {
            throw new RuntimeException("Document is already rejected");
        }
        if (documents.getStatus() == VerificationStatus.VERIFIED) {
            throw new RuntimeException("Document is already verified");
        }


        documents.setStatus(VerificationStatus.REJECTED);
        documents.setRejectedReason(reason);


        WorkerProfile workerProfile = workerRepo.findById(documents.getUserID())
                .orElseThrow(() -> new RuntimeException("Worker is not found"));
        workerProfile.setAadhaarVerified(false);
        workerRepo.save(workerProfile);
        repo.save(documents);


        sendRejectEmail(workerProfile, reason);

        
        scheduleProfileDeletion(workerProfile, documents.getId());

        return "Worker is rejected";
    }

    // ════════════════════════════════════════════════════════════
    //  Private helpers – email & timer
    // ════════════════════════════════════════════════════════════

    private void sendAcceptEmail(WorkerProfile worker) {
        String htmlBody = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                  <div style="background: linear-gradient(135deg, #28a745, #218838); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">✅ Document Verified</h1>
                  </div>
                  <div style="padding: 30px;">
                    <p style="font-size: 16px;">Dear <strong>%s</strong>,</p>
                    <p style="font-size: 15px; line-height: 1.6;">
                      Congratulations! Your <strong>Aadhaar document</strong> has been successfully verified by our admin team.
                    </p>
                    <div style="background: #f0fdf4; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 15px;">
                        🎉 You can now use <strong>GramWork</strong> application with full access to all features including job assignments, attendance, and payments.
                      </p>
                    </div>
                    <p style="font-size: 14px; color: #666;">
                      If you have any questions, feel free to reach out to our support team.
                    </p>
                    <p style="font-size: 14px; margin-top: 30px;">
                      Best regards,<br/><strong>GramWork Admin Team</strong>
                    </p>
                  </div>
                  <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    © 2026 GramWork. All rights reserved.
                  </div>
                </div>
                """.formatted(worker.getName());

        NotificationEvent event = NotificationEvent.builder()
                .recipientId(worker.getUserId())
                .email(worker.getEmail())
                .subject("✅ GramWork - Your Aadhaar Document Has Been Verified")
                .body(htmlBody)
                .category("DOCUMENT_VERIFICATION")
                .messageType(MessageType.EMAIL)
                .build();

        rabbitTemplate.convertAndSend(notificationExchange, notificationRoutingKey, event);
        log.info("Sent accept email notification for worker {}", worker.getUserId());
    }

    private void sendRejectEmail(WorkerProfile worker, String reason) {
        String htmlBody = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                  <div style="background: linear-gradient(135deg, #dc3545, #c82333); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">❌ Document Rejected</h1>
                  </div>
                  <div style="padding: 30px;">
                    <p style="font-size: 16px;">Dear <strong>%s</strong>,</p>
                    <p style="font-size: 15px; line-height: 1.6;">
                      We regret to inform you that your <strong>Aadhaar document</strong> has been <strong style="color: #dc3545;">rejected</strong> by our admin team.
                    </p>
                    <div style="background: #fff3f3; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; color: #555;"><strong>Reason for Rejection:</strong></p>
                      <p style="margin: 5px 0 0; font-size: 15px; color: #dc3545; font-weight: bold;">%s</p>
                    </div>
                    <div style="background: #fff8e1; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 15px; color: #856404;">
                        ⚠️ <strong>WARNING:</strong> Please contact the admin within <strong>24 hours</strong> to resolve this issue.
                        If no action is taken, your profile will be <strong>permanently deleted</strong> from GramWork.
                      </p>
                    </div>
                    <div style="text-align: center; margin: 25px 0;">
                      <p style="font-size: 15px;"><strong>📧 Admin Email:</strong> support@gramwork.in</p>
                      <p style="font-size: 15px;"><strong>📞 Admin Phone:</strong> +91-XXXXXXXXXX</p>
                    </div>
                    <p style="font-size: 14px; color: #666;">
                      You may re-upload a clear copy of your Aadhaar document after contacting the admin.
                    </p>
                    <p style="font-size: 14px; margin-top: 30px;">
                      Regards,<br/><strong>GramWork Admin Team</strong>
                    </p>
                  </div>
                  <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    © 2026 GramWork. All rights reserved.
                  </div>
                </div>
                """.formatted(worker.getName(), reason);

        NotificationEvent event = NotificationEvent.builder()
                .recipientId(worker.getUserId())
                .email(worker.getEmail())
                .subject("❌ GramWork - Your Aadhaar Document Has Been Rejected")
                .body(htmlBody)
                .category("DOCUMENT_REJECTION")
                .messageType(MessageType.EMAIL)
                .build();

        rabbitTemplate.convertAndSend(notificationExchange, notificationRoutingKey, event);
        log.info("Sent reject email notification for worker {}", worker.getUserId());
    }

    private void scheduleProfileDeletion(WorkerProfile worker, String documentId) {
        ProfileDeleteEvent event = ProfileDeleteEvent.builder()
                .workerId(worker.getUserId())
                .workerEmail(worker.getEmail())
                .workerName(worker.getName())
                .documentId(documentId)
                .build();

        rabbitTemplate.convertAndSend(profileDeleteWaitExchange, profileDeleteWaitRoutingKey, event);
        log.info("Scheduled profile deletion for worker {} (24-hour TTL timer started)", worker.getUserId());
    }
}
