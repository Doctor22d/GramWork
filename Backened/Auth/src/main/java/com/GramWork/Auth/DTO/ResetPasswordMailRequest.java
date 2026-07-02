package com.GramWork.Auth.DTO;

import com.GramWork.Auth.Validator.PasswordMatch;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResetPasswordMailRequest {
    private String email;
}
