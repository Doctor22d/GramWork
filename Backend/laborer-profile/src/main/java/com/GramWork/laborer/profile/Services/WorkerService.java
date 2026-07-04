package com.GramWork.laborer.profile.Services;

import com.GramWork.laborer.profile.Client.UserClient;
import com.GramWork.laborer.profile.DTO.Auth;
import com.GramWork.laborer.profile.DTO.LocationUpdateRequest;
import com.GramWork.laborer.profile.DTO.RequestUpdate;
import com.GramWork.laborer.profile.DTO.RequestWorker;
import com.GramWork.laborer.profile.Repository.DocumentRepo;
import com.GramWork.laborer.profile.Repository.workerRepository;
import com.GramWork.laborer.profile.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.io.IOException;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class WorkerService {
    private final workerRepository workerRepository;
    private final UserClient userClient;
    private final S3Service s3Service;
    static Integer[][] d = {
            {0,1,2,3,4,5,6,7,8,9},
            {1,2,3,4,0,6,7,8,9,5},
            {2,3,4,0,1,7,8,9,5,6},
            {3,4,0,1,2,8,9,5,6,7},
            {4,0,1,2,3,9,5,6,7,8},
            {5,9,8,7,6,0,4,3,2,1},
            {6,5,9,8,7,1,0,4,3,2},
            {7,6,5,9,8,2,1,0,4,3},
            {8,7,6,5,9,3,2,1,0,4},
            {9,8,7,6,5,4,3,2,1,0}
    };

    static Integer[][] p = {
            {0,1,2,3,4,5,6,7,8,9},
            {1,5,7,6,2,8,3,0,9,4},
            {5,8,0,3,7,9,6,1,4,2},
            {8,9,1,6,0,4,3,5,2,7},
            {9,4,5,3,1,2,6,8,7,0},
            {4,2,8,6,5,7,3,9,0,1},
            {2,7,9,3,8,0,6,4,1,5},
            {7,0,4,6,9,1,3,2,5,8}
    };
    private final DocumentRepo documentRepo;
    public static Boolean validateVerhoeff(String aadhaar) {
        Integer checksum = 0;

        for (Integer i = 0; i < aadhaar.length(); i++) {
            Integer digit = Integer.valueOf(
                    String.valueOf(
                            aadhaar.charAt(aadhaar.length() - 1 - i)
                    )
            );

            checksum = d[checksum][p[i % 8][digit]];
        }

        return checksum == 0;
    }

    public String addWorker(RequestWorker requestWorker) {
        Auth auth=userClient.getUser(requestWorker.getUserID());
        if (workerRepository.findByPhone(auth.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }
        String Aadhaar=verifyAadhaar(requestWorker.getAadhaarNumber());
        if(Aadhaar==null){
            throw new RuntimeException("Aadhaar number is not valid");
        }
        WorkerProfile worker = WorkerProfile.builder()
                .userId(requestWorker.getUserID())
                .name(requestWorker.getName())
                .age(requestWorker.getAge())
                .gender(requestWorker.getGender())
                .phone(auth.getPhoneNumber())
                .email(auth.getEmail())
                .aadhaarNumber(Aadhaar)
                .aadhaarVerified(false)
                .village(requestWorker.getVillage())
                .skill(requestWorker.getSkill())
                .role(auth.getRole())
                .yearsOfExperience(requestWorker.getYearsOfExperience())
                .dailyWage(requestWorker.getDailyWage())
                .availability(requestWorker.getAvailability())
                .workingHours(requestWorker.getWorkingHours())
                .preferredCategories(requestWorker.getPreferredCategories())
                .languagesKnown(requestWorker.getLanguagesKnown())
                .location(
                        new GeoJsonPoint(
                                requestWorker.getLongitude(),
                                requestWorker.getLatitude()
                        )
                )
                .rating(0.0)
                .reviews(0)
                .totalJobsCompleted(0)
                .reliabilityScore(0.0)
                .build();
        workerRepository.save(worker);
        return "user Registered Successfully";

    }

    private String verifyAadhaar(String aadhaarNumber) {
        if(!validateVerhoeff(aadhaarNumber)){
            return null;
        }
        return aadhaarNumber.substring(0,aadhaarNumber.length()-4).replaceAll("\\d","X")
                +aadhaarNumber.substring(aadhaarNumber.length()-4);

    }

    public WorkerProfile getProfile(String id) {

        return workerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Worker Profile Not Found"));
    }

    public String updateProfile(String userId, RequestUpdate requestWorker) {
        WorkerProfile worker = workerRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("Worker not found"));

        worker.setName(requestWorker.getName());
        worker.setAge(requestWorker.getAge());
        worker.setPhone(requestWorker.getPhone());
        worker.setVillage(requestWorker.getVillage());

        worker.setSkill(requestWorker.getSkill());
        worker.setYearsOfExperience(requestWorker.getYearsOfExperience());
        worker.setDailyWage(requestWorker.getDailyWage());
        worker.setAvailability(requestWorker.getAvailability());
        worker.setWorkingHours(requestWorker.getWorkingHours());
        worker.setPreferredCategories(requestWorker.getPreferredCategories());
        worker.setLanguagesKnown(requestWorker.getLanguagesKnown());

        workerRepository.save(worker);

        return "Profile Updated Successfully";
    }

    public String updateLocation(String userId,LocationUpdateRequest locationUpdateRequest) {
        WorkerProfile worker = workerRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("Worker not found"));

        worker.setLocation(
                new GeoJsonPoint(
                        locationUpdateRequest.getLongitude(),
                        locationUpdateRequest.getLatitude()
                )
        );

        workerRepository.save(worker);
        return "Location Updated Successfully";
    }

    public String  checkID(String id) {
        if(!workerRepository.existsById(id)){
           return null;
        }
        return id;
    }

    public void upadteAvail(String id, Availability status) {
        WorkerProfile worker=workerRepository.findById(id)
                .orElseThrow(
                        ()-> new RuntimeException("Worker is not found")
                );
        worker.setAvailability(status);
        workerRepository.save(worker);
    }

    public void updateJob(String id) {
        WorkerProfile workerProfile=workerRepository.findById(id)
                .orElseThrow(
                        ()-> new RuntimeException("Worker is not found")
                );
        workerProfile.setTotalJobsCompleted(workerProfile.getTotalJobsCompleted()+1);
        workerRepository.save(workerProfile);
    }

    public String uploadAadhaar(MultipartFile file, String userId, DocumentType documentType) throws IOException {
        if(file.isEmpty()){
            throw new RuntimeException("File is Empty");
        }
        if(!workerRepository.existsById(userId)){
            throw new RuntimeException("Worker Not Found");
        }
        if(documentRepo.findByUserID(userId)){
            throw new RuntimeException("Document already exists. wait for verification");
        }
        String key=s3Service.uploadFile(file);
        Documents documents= Documents.builder()
                .documentType(documentType)
                .status(VerificationStatus.PENDING)
                .fileSize(file.getSize())
                .fileName(file.getOriginalFilename())
                .uploadDate(LocalDateTime.now())
                .userID(userId)
                .key(key)
                .build();
        documentRepo.save(documents);

        return "Document Uploaded Successfully";
    }
}
