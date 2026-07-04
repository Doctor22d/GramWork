package com.GramWork.Auth.DTO;

import com.GramWork.Auth.Model.Role;
import com.GramWork.Auth.Validator.PasswordMatch;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@PasswordMatch
public class RegisterRequest {
    @NotNull(message = "Email is required")
    @Email(message = "Email is invalid")
    private String email;
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$",
            message = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
    )
    private String password;
    private String confirmPassword;
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Please enter a valid 10-digit Indian mobile number"
    )
    private String phoneNumber;
    private Role role;
}
