package com.GramWork.laborer.profile.DTO;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@RequestMapping
public class requestEmployer {
    private String userID;
    private String employerName;

    @Email(message = "Email is not valid")
    private String employerEmail;

    private String employerPhone;

    private String aadhaarNumber;

}
