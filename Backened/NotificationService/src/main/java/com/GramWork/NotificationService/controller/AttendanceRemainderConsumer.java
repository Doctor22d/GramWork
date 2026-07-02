package com.GramWork.NotificationService.controller;

import com.GramWork.NotificationService.Client.AttendanceClient;
import com.GramWork.NotificationService.dto.AttendanceRemainderEvent;
import com.GramWork.NotificationService.dto.NotificationEvent;
import com.GramWork.NotificationService.entity.MessageType;
import com.GramWork.NotificationService.service.InAppNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AttendanceRemainderConsumer {
    private final InAppNotificationService inAppNotificationService;
    private final AttendanceClient attendanceClient;

    @RabbitListener(queues = "attendance.queue")
    public void consume(
            AttendanceRemainderEvent event
    ){
        boolean marked = attendanceClient.isAttendanceMarked(event.getAssignmentID());
        if (!marked) {
            NotificationEvent notification = NotificationEvent.builder()
                    .recipientId(event.getEmployerID())
                    .subject("Attendance Reminder")
                    .body("Please mark the attendance for your ongoing assignment.")
                    .category("ATTENDANCE_REMINDER")
                    .messageType(MessageType.IN_APP)
                    .build();
            inAppNotificationService.processInAppNotification(notification);
        }
    }
}
