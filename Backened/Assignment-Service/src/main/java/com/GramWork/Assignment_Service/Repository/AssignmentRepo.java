package com.GramWork.Assignment_Service.Repository;

import com.GramWork.Assignment_Service.model.Assignment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepo extends MongoRepository<Assignment, String> {
    List<Assignment> findByEmployerId(String employerId);
    List<Assignment> findByJobId(String jobId);

    List<Assignment> findByStartedDateBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}
