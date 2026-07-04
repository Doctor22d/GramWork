package com.gramwork.ReviewService.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCreatedEvent {
    private String reviewId;
    private String workerId;
    private String employerId;
    private Integer rating;
    private String comment;
}
