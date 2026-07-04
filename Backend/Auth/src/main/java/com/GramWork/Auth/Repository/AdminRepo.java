package com.GramWork.Auth.Repository;

import com.GramWork.Auth.Model.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepo extends MongoRepository<Admin,String> {
    Optional<Admin> findByUsername(String username);
}
