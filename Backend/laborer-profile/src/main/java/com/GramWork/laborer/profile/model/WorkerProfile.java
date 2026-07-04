package com.GramWork.laborer.profile.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "worker_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfile {

    @Id
    @org.springframework.data.mongodb.core.mapping.MongoId(org.springframework.data.mongodb.core.mapping.FieldType.OBJECT_ID)
    private String userId;

    private String name;

    private Integer age;

    private Gender gender;

    private String phone;
    private String email;


    private String aadhaarNumber;

    private Boolean aadhaarVerified;

    private String village;


    @GeoSpatialIndexed
    private GeoJsonPoint location;

    private String skill;

    private Integer yearsOfExperience;

    private Double dailyWage;

    private Availability availability;

    private String workingHours;
    private Role role;
    private List<String> preferredCategories;

    private List<String> languagesKnown;

    private Double rating;

    private Integer reviews;

    private Integer totalJobsCompleted;

    private Double reliabilityScore;

    public void setPhone(String phone) {

        if (phone == null || !phone.matches("[6-9]\\d{9}")) {
            throw new IllegalArgumentException("Invalid Indian phone number");
        }

        this.phone = phone;
    }
}