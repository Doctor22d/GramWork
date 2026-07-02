package com.GramWork.Auth.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "Auth_User")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Auth {
    @Id
    private String id;
    @NotNull(message = "Email is required")
    @Email(message = "Email is invalid")
    @Indexed
    private String email;
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
    )
    @JsonIgnore
    private String password;
    @JsonIgnore
    @Transient
    private String confirmPassword;
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Please enter a valid Indian mobile number"
    )
    @Indexed
    private String phoneNumber;
    private Role role;
    private boolean isVerified;
    private boolean isActive;

    @CreatedDate
    private LocalDateTime registerDate;
    @LastModifiedDate
    private LocalDateTime updateDate;
}
