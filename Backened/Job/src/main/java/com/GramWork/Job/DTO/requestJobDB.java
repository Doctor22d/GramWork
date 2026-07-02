package com.GramWork.Job.DTO;

import com.GramWork.Job.model.Category;
import com.GramWork.Job.model.JobStatus;
import com.GramWork.Job.model.UrgencyLevel;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class requestJobDB {

    @NotBlank(message = "employerId is required")
    private String employerId;

    @NotBlank(message = "employerName is required")
    private String employerName;

    @NotBlank(message = "title is required")
    private String title;

    private String description;

    @NotNull(message = "category is required")
    private Category category;

    private String requiredSkills;

    @NotNull(message = "requiredWorkers is required")
    @Min(value = 1, message = "requiredWorkers must be at least 1")
    private Integer requiredWorkers;

    @NotNull(message = "wage is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "wage must be non-negative")
    private Double wage;

    private String duration;

    @NotNull(message = "urgencyLevel is required")
    private UrgencyLevel urgencyLevel;


    @NotNull(message = "latitude is required")
    private Double latitude;

    @NotNull(message = "longitude is required")
    private Double longitude;

    @NotBlank(message = "address is required")
    private String address;

    private String village;
    private String pincode;

    private List<String> workImages;

    private JobStatus status;

    @NotNull(message = "startDate is required")
    private LocalDateTime startDate;

    private LocalDateTime deadline;
}
