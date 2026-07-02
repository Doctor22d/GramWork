package com.GramWork.laborer.profile.DTO;

import com.GramWork.laborer.profile.model.Availability;
import com.GramWork.laborer.profile.model.Gender;
import lombok.*;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import java.util.List;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseWorker {
    private String userId;

    private String name;

    private Integer age;

    private Gender gender;

    private String phone;

    private String aadhaarNumber;

    private Boolean aadhaarVerified;

    private String village;

    private GeoJsonPoint location;

    private String skill;

    private Integer yearsOfExperience;

    private Double dailyWage;

    private Availability availability;

    private String workingHours;

    private List<String> preferredCategories;

    private List<String> languagesKnown;

    private Double rating;

    private Integer reviews;

    private Integer totalJobsCompleted;

    private Double reliabilityScore;
}
