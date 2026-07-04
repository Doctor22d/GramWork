package com.GramWork.Assignment_Service.Schedular;

import com.GramWork.Assignment_Service.DTO.NotificationEvent;
import com.GramWork.Assignment_Service.Repository.AssignmentRepo;
import com.GramWork.Assignment_Service.model.Assignment;
import com.GramWork.Assignment_Service.model.MessageType;
import com.GramWork.Assignment_Service.Service.InAppNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class AttendanceRemainderAlert {
    private final AssignmentRepo repo;
    private final InAppNotificationService notificationProducer;

    @Scheduled(cron = "0 0 19 * * ?")
    public void SendAlert(){
        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        List<Assignment> assignments =
                repo.findByStartedDateBetween(startOfDay, endOfDay);
        Set<String> employerIds = assignments.stream()
                .map(Assignment::getEmployerId)
                .collect(Collectors.toSet());
        for(String id : employerIds){
            String message = "Please take attendance for today's workers.";

            NotificationEvent event = NotificationEvent.builder()
                    .recipientId(id)
                    .subject("Attendance Reminder")
                    .body(message)
                    .messageType(MessageType.IN_APP)
                    .category("ATTENDANCE_ALERT")
                    .build();

            notificationProducer.processInAppNotification(event);
        }

    }
}
