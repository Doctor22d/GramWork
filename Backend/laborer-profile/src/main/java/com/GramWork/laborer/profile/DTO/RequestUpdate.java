package com.GramWork.laborer.profile.DTO;

import com.GramWork.laborer.profile.model.Availability;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class RequestUpdate {

    private String name;

    private Integer age;

    private String phone;

    private String village;

    private String skill;

    private Integer yearsOfExperience;

    private Double dailyWage;

    private Availability availability;

    private String workingHours;

    private List<String> preferredCategories;

    private List<String> languagesKnown;


    private Integer totalJobsCompleted;


}
