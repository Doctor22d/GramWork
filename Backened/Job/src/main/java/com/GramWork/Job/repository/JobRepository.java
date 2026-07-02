package com.GramWork.Job.repository;



import com.GramWork.Job.model.JobDB;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRepository extends MongoRepository<JobDB,String> {
}
