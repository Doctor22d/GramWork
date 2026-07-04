package com.gramwork.ReviewService.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
    @NotNull(message = "message is not Null")
    private String comment;
    @NotNull
    private String reviewerID;
    @NotNull(message = "Rating is not filled")
    @Min(value = 1,message = "Rating is in between 1-5")
    @Max(value = 5,message = "Rating is in Between 1-5")
    private Integer rating;
    @NotNull
    private String reviewUserID;
}
