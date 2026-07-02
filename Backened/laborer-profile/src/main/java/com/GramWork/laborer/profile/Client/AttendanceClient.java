package com.GramWork.laborer.profile.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(
        url = "http://localhost:8085",
        name = "Attendance-Service"
)
public interface AttendanceClient {
    @PutMapping("/api/attendance/{AttendanceID}/worker/{workerID}/markAttendance")
    void markAttendance(@PathVariable("AttendanceID") String AttendanceID, @PathVariable("workerID") String workerID);
}
