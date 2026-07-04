package com.GramWork.Auth.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.GramWork.Auth.Validator.PasswordMatch;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@PasswordMatch
public class ResetPasswordRequest {
    @JsonProperty("otp")
    private String OTP;
    private String email;
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
    )
    private String password;
    private String confirmPassword;
}
