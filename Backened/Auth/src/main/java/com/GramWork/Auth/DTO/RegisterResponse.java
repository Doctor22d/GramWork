package com.GramWork.Auth.DTO;

import com.GramWork.Auth.Model.Role;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

public class RegisterResponse {
    private String email;

    private String phoneNumber;
    private Role role;
    private boolean isVerified;
    private boolean isActive;

    @CreatedDate
    private LocalDateTime registerDate;
    @LastModifiedDate
    private LocalDateTime updateDate;
    public void setPhoneNumber(String phoneNumber){
        if(phoneNumber == null || phoneNumber.isEmpty()){
            throw new IllegalArgumentException("Phone number is required");
        }
        if(phoneNumber.length()>10){
            throw new IllegalArgumentException("Phone number is not valid");
        }
        this.phoneNumber=phoneNumber;
    }
}
