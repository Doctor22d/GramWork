package com.GramWork.laborer.profile.Services;

import com.GramWork.laborer.profile.Client.AttendanceClient;
import com.GramWork.laborer.profile.Client.UserClient;
import com.GramWork.laborer.profile.DTO.*;
import com.GramWork.laborer.profile.Repository.employerRepository;
import com.GramWork.laborer.profile.Repository.workerRepository;
import com.GramWork.laborer.profile.model.EmployerProfile;
import com.GramWork.laborer.profile.model.WorkerProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class EmployerService {
    private final employerRepository employerrepository;
    private final workerRepository workerRepository;
    private final AttendanceClient client;
    private final UserClient userClient;
    public responseEmployer posting(requestEmployer request) {
        Auth auth=userClient.getUser(request.getUserID());
        if(employerrepository.findByemployerPhone(auth.getPhoneNumber()).isPresent()){
            throw new RuntimeException("Employer phone is already registered");
        }
        EmployerProfile job = EmployerProfile.builder()
                .employerName(request.getEmployerName())
                .employerEmail(auth.getEmail())
                .employerPhone(auth.getPhoneNumber())
                .role(auth.getRole())
                .aadhaarNumber(request.getAadhaarNumber())
                .build();

        EmployerProfile saved = employerrepository.save(job);

        return responseEmployer.builder()
                .employerId(saved.getEmployerId())
                .employerName(saved.getEmployerName())
                .employerEmail(saved.getEmployerEmail())
                .employerPhone(saved.getEmployerPhone())
                .aadhaarNumber(saved.getAadhaarNumber())
                .build();
    }

    public List<WorkerProfile> findnearBY(nearbyRequest nearby) {
        GeoJsonPoint point = new GeoJsonPoint(
                nearby.getLongitude(),
                nearby.getLatitude()
        );

        double radiusInMeters = nearby.getRadius() * 1000;

        return workerRepository.findNearbyWorkers(
                point,
                radiusInMeters);

    }

    public boolean checkID(String id) {
        if(!employerrepository.existsById(id)){
            return false;
        }
        return true;
    }

    public EmployerProfile getWorker(String id) {
        return employerrepository.findById(id)
                .orElseThrow(()->new RuntimeException("employer not found"));
    }

    public String markAttendance(requestAttendance request) {
        try{
            client.markAttendance(request.getAttendanceID(), request.getWorkerID());
            return "success";
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }

    public List<WorkerProfile> FindNearByWorkerForMatching(Double latitude, Double longitude) {
        GeoJsonPoint point = new GeoJsonPoint(longitude, latitude);

        double defaultRadiusInMeters = 10000; 
        
        return workerRepository.findNearbyWorkers(point, defaultRadiusInMeters);
    }
}
