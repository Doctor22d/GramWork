package com.GramWork.Attendence.Repository;

import com.GramWork.Attendence.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {

    // Find all attendance records for a specific job
    List<Attendance> findByJobID(String jobId);

    @org.springframework.data.mongodb.repository.Query("{'_id': ?0}")
    java.util.Optional<Attendance> findByStringId(String id);

    // Find attendance records where a specific workerId exists inside the Workers list
    List<Attendance> findByWorkers(String workerId);
}
