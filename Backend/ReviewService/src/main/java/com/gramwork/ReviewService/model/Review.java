package com.gramwork.ReviewService.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Reviews")
public class Review {
    @Id
    private String reviewID;
    @NotNull
    private String reviewerID;
    @NotNull
    private String assignmentID;
    private String comment;
    private Integer rating;
    @NotNull
    private LocalDateTime reviewDate;
    @Builder.Default
    private boolean isEdited=false;
    @LastModifiedDate
    private LocalDateTime updateDate;
    private String reviewUserID;
    private ReviewerType type;
    @Builder.Default
    private Status status=Status.PENDING;
}
