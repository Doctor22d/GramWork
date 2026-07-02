package com.GramWork.Job.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Job_Service")
public class JobDB {
    @Id
    @com.fasterxml.jackson.annotation.JsonProperty("jobId")
    private String id;
    
    @Indexed
    private String employerId;
    private String employerName;


    private String title;
    private String description;
    
    @Indexed
    private Category category;

    private String requiredSkills;

    private Integer requiredWorkers;
    private Integer hiredWorkers;

    private Double wage;
    private String duration;

    private UrgencyLevel urgencyLevel;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;

    private String address;
    
    @Indexed
    private String village;
    
    @Indexed
    private String pincode;


    private List<String> workImages;


    @Indexed
    private JobStatus status;


    private LocalDateTime startDate;
    private LocalDateTime deadline;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;


}
