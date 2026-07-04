package com.GramWork.laborer.profile.Repository;

import com.GramWork.laborer.profile.model.EmployerProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface employerRepository extends MongoRepository<EmployerProfile,String> {

    Optional<EmployerProfile> findByEmployerId(String employerId);

    Optional<EmployerProfile> findByemployerPhone(String employerPhone);
}
