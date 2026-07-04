package com.GramWork.Auth.Repository;

import com.GramWork.Auth.Model.Auth;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepo extends MongoRepository<Auth,String> {

    boolean existsByEmail(String email);

    Optional<Auth> findByEmail(String email);
}
