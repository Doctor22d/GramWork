package com.GramWork.laborer.profile.DTO;

import jakarta.validation.constraints.Email;
import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class responseEmployer {

    private String employerId;

    private String employerName;

    private String employerEmail;

    private String employerPhone;

    private String aadhaarNumber;
}
