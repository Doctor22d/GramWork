package com.GramWork.laborer.profile.Repository;

import com.GramWork.laborer.profile.model.WorkerProfile;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface workerRepository extends MongoRepository<WorkerProfile, String> {

    Optional<WorkerProfile> findByPhone(String phone);
    @Query("""
    {
      location: {
        $near: {
          $geometry: ?0,
          $maxDistance: ?1
        }
      }
    }
    """)
    List<WorkerProfile> findNearbyWorkers(
            GeoJsonPoint location,
            double maxDistance
    );
}
