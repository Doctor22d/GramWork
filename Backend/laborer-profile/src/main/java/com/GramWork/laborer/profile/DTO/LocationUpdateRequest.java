package com.GramWork.laborer.profile.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LocationUpdateRequest {
    private Double longitude;
    private Double latitude;
}
