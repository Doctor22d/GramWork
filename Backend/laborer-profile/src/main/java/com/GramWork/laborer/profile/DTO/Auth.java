package com.GramWork.laborer.profile.DTO;

import com.GramWork.laborer.profile.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Auth {
    @Id
    private String id;
    @NotNull(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Please enter a valid Indian mobile number"
    )
    private String phoneNumber;
    private Role role;
}
