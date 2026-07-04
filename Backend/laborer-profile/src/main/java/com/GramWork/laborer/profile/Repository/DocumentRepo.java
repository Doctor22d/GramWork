package com.GramWork.laborer.profile.Repository;

import com.GramWork.laborer.profile.model.Documents;
import com.GramWork.laborer.profile.model.VerificationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepo extends MongoRepository<Documents,String> {

    List<Documents> findByStatus(VerificationStatus status);

    boolean findByUserID(String userId);
}
