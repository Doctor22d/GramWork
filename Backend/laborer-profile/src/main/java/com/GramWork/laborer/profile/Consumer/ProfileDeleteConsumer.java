package com.GramWork.laborer.profile.Consumer;

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
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProfileDeleteConsumer {

    private final workerRepository workerRepo;
    private final DocumentRepo documentRepo;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.notification}")
    private String notificationExchange;

    @Value("${rabbitmq.routing-key.notification}")
    private String notificationRoutingKey;


    @RabbitListener(queues = "${rabbitmq.queue.profile-delete}")
    public void handleProfileDeletion(ProfileDeleteEvent event) {
        log.info("Profile deletion timer expired for worker: {}", event.getWorkerId());

        try {
            Optional<Documents> docOpt = documentRepo.findById(event.getDocumentId());
            if (docOpt.isPresent() && docOpt.get().getStatus() == VerificationStatus.VERIFIED) {
                log.info("Worker {} document was re-verified within 24 hours. Skipping deletion.",
                        event.getWorkerId());
                return;
            }


            Optional<WorkerProfile> workerOpt = workerRepo.findById(event.getWorkerId());
            if (workerOpt.isEmpty()) {
                log.info("Worker {} profile already deleted. Skipping.", event.getWorkerId());
                return;
            }

            WorkerProfile worker = workerOpt.get();

            workerRepo.deleteById(event.getWorkerId());
            log.info("Deleted worker profile: {}", event.getWorkerId());


            sendDeletionEmail(event);

            sendDeletionInAppNotification(event);

        } catch (Exception e) {
            log.error("Failed to process profile deletion for worker {}: {}",
                    event.getWorkerId(), e.getMessage(), e);
            throw e;
        }
    }

    private void sendDeletionEmail(ProfileDeleteEvent event) {
        String htmlBody = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                  <div style="background: linear-gradient(135deg, #6c757d, #495057); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">🚨 Profile Deleted</h1>
                  </div>
                  <div style="padding: 30px;">
                    <p style="font-size: 16px;">Dear <strong>%s</strong>,</p>
                    <p style="font-size: 15px; line-height: 1.6;">
                      Your profile on <strong>GramWork</strong> has been <strong style="color: #dc3545;">permanently deleted</strong>
                      because you did not contact the admin within 24 hours after your Aadhaar document was rejected.
                    </p>
                    <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 15px; color: #721c24;">
                        Your worker profile, including all associated data, has been removed from our system.
                      </p>
                    </div>
                    <div style="background: #e2e3e5; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 15px; color: #383d41;">
                        If you believe this was a mistake, please contact the admin immediately to re-register:
                      </p>
                      <p style="margin: 10px 0 0; font-size: 15px;">
                          <strong>📧 Email:</strong>
                          <a href="mailto:docker179@gmail.com"
                             style="color:#2563eb;text-decoration:none;">
                              docker179@gmail.com
                          </a>
                      </p>
                    </div>
                    <p style="font-size: 14px; margin-top: 30px;">
                      Regards,<br/><strong>GramWork Admin Team</strong>
                    </p>
                  </div>
                  <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                    © 2026 GramWork. All rights reserved.
                  </div>
                </div>
                """.formatted(event.getWorkerName());

        NotificationEvent emailEvent = NotificationEvent.builder()
                .recipientId(event.getWorkerId())
                .email(event.getWorkerEmail())
                .subject("🚨 GramWork - Your Profile Has Been Deleted")
                .body(htmlBody)
                .category("PROFILE_DELETION")
                .messageType(MessageType.EMAIL)
                .build();

        rabbitTemplate.convertAndSend(notificationExchange, notificationRoutingKey, emailEvent);
        log.info("Sent profile deletion email to {}", event.getWorkerEmail());
    }

    private void sendDeletionInAppNotification(ProfileDeleteEvent event) {
        NotificationEvent inAppEvent = NotificationEvent.builder()
                .recipientId(event.getWorkerId())
                .subject("Profile Deleted")
                .body("Your GramWork profile has been deleted due to unresolved Aadhaar document rejection. Contact admin to re-register.")
                .category("PROFILE_DELETION")
                .messageType(MessageType.IN_APP)
                .build();

        rabbitTemplate.convertAndSend(notificationExchange, notificationRoutingKey, inAppEvent);
        log.info("Sent in-app deletion notification for worker {}", event.getWorkerId());
    }
}
