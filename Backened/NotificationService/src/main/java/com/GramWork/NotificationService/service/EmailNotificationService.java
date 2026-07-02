package com.GramWork.NotificationService.service;

import com.GramWork.NotificationService.dto.NotificationEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailNotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void processEmailNotification(NotificationEvent event) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(event.getEmail());
            helper.setSubject(event.getSubject());
            helper.setText(event.getBody(), true); // true enables HTML

            mailSender.send(message);
            log.info("Email successfully sent to {}", event.getEmail());
        } catch (Exception e) {
            log.error("Failed to send email to {}", event.getEmail(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
