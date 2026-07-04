package com.GramWork.laborer.profile.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class nearbyRequest {
    private Double longitude;
    private Double latitude;
    private Double radius;
}
