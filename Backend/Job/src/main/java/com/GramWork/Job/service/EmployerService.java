package com.GramWork.Job.service;

import com.GramWork.Job.Client.EmployerClient;
import com.GramWork.Job.DTO.requestJobDB;
import com.GramWork.Job.DTO.responseJobDB;
import com.GramWork.Job.model.JobDB;
import com.GramWork.Job.model.JobStatus;
import com.GramWork.Job.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployerService {

    private final JobRepository jobRepository;
    private final EmployerClient client;

    public responseJobDB posting(requestJobDB request) {
        if(!client.checkEmployerID(request.getEmployerId())){
            throw new RuntimeException("Employer ID is not valid");
        }

        if (request.getLatitude() == null || request.getLongitude() == null) {
            throw new IllegalArgumentException("latitude and longitude are required and must not be null");
        }

        JobDB job = JobDB.builder()
                .employerId(request.getEmployerId())
                .employerName(request.getEmployerName())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .requiredSkills(request.getRequiredSkills())
                .requiredWorkers(request.getRequiredWorkers())
                .hiredWorkers(0)
                .wage(request.getWage())
                .duration(request.getDuration())
                .urgencyLevel(request.getUrgencyLevel())
                .location(
                        new GeoJsonPoint(
                                request.getLongitude(),
                                request.getLatitude()
                        )
                )
                .address(request.getAddress())
                .village(request.getVillage())
                .pincode(request.getPincode())
                .workImages(request.getWorkImages())
                .status(JobStatus.OPEN)
                .startDate(request.getStartDate())
                .deadline(request.getDeadline())
                .build();

        JobDB saved = jobRepository.save(job);

        return responseJobDB.builder()
                .jobId(saved.getId())
                .title(saved.getTitle())
                .employerId(saved.getEmployerId())
                .employerName(saved.getEmployerName())
                .status(saved.getStatus())
                .build();
    }

    public boolean checkID(String id) {
        return jobRepository.existsById(id);
    }

    public JobDB getJobById(String id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found: " + id));
    }

    public void updateHire(String jobId, int i) {
        JobDB job=jobRepository.findById(jobId).orElseThrow(
                ()-> new RuntimeException("JobId is invalid or not Found")
        );
        job.setHiredWorkers(i);
        jobRepository.save(job);
    }
}
