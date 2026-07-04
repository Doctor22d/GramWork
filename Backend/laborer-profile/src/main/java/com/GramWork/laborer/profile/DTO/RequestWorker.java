package com.GramWork.laborer.profile.DTO;

import com.GramWork.laborer.profile.model.Availability;
import com.GramWork.laborer.profile.model.Gender;
import lombok.*;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;

import java.util.List;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestWorker {
    private String userID;

    private Integer age;
    private String name;

    private Gender gender;

    private String aadhaarNumber;

    private String village;

    private Double latitude;

    private Double longitude;

    private Integer yearsOfExperience;

    private Double dailyWage;

    private Availability availability;

    private String workingHours;

    private List<String> preferredCategories;

    private List<String> languagesKnown;

    private Double rating;

    private Integer reviews;

    private String skill;

    private Integer totalJobsCompleted;

    private Double reliabilityScore;
}
