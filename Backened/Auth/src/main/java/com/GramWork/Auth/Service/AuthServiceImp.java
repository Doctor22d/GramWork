package com.GramWork.Auth.Service;

import com.GramWork.Auth.DTO.*;
import com.GramWork.Auth.Model.Auth;
import com.GramWork.Auth.Repository.AuthRepo;
import com.GramWork.Auth.Security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImp implements AuthService{
    private final AuthRepo repo;
    private final OTPService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    @Override
    public String register(RegisterRequest registerRequest) {
        if(repo.existsByEmail(registerRequest.getEmail())){
            throw new RuntimeException("Email already exists");
        }
        Auth auth=Auth.builder()
                .email(registerRequest.getEmail())
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(registerRequest.getRole())
                .isActive(false)
                .isVerified(false)
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();
        repo.save(auth);
        return auth.getId();
    }

    @Override
    public String SendOTP(String userID) {
        Auth auth=repo.findById(userID)
                .orElseThrow(
                        ()-> new RuntimeException("User not found")
                );
        otpService.sendOTPbyEmail(auth.getEmail());
        repo.save(auth);
        return "Send OTP Success";
    }

    @Override
    public String verifyOTP(String userID, OTPRequest request) {
        Auth auth=repo.findById(userID)
                .orElseThrow(
                        ()-> new RuntimeException("User not Found")
                );
        otpService.verifyOTPbyEmail(auth.getEmail(), request.getOTP());
        auth.setActive(true);
        auth.setVerified(true);
        repo.save(auth);
        return "OTP Verification Success";
    }

    @Override
    public String login(LoginRequest request) {
        Auth auth=repo.findByEmail(request.getEmail())
                .orElseThrow(
                        ()-> new RuntimeException("Email is incorrect")
                );
        if(!auth.isVerified()){
            throw new RuntimeException("User is not verified");
        }
        if(!auth.isActive()){
            throw new RuntimeException("User is not active");
        }
        if(!passwordEncoder.matches(request.getPassword(), auth.getPassword())){
            throw new RuntimeException("Password is incorrect");
        }
        return jwtUtils.generateToken(auth.getId(), String.valueOf(auth.getRole()));
    }

    @Override
    public String resetPasswordMail(ResetPasswordMailRequest request) {
        Auth auth=repo.findByEmail(request.getEmail())
                .orElseThrow(
                        ()-> new RuntimeException("Email is not exists")
                );
        if(!auth.isVerified()){
            throw new RuntimeException("User is not verified");
        }
        if (!auth.isActive()) {
            throw new RuntimeException("User is not active");
        }
        otpService.sendOTPbyEmailForReset(auth.getEmail());
        return "send OTP for Reset Success";
    }

    @Override
    public String resetPassword(ResetPasswordRequest request) {
        Auth auth=repo.findByEmail(request.getEmail())
                .orElseThrow(
                        ()-> new RuntimeException("Email is not exists")
                );
        if(!auth.isVerified()){
            throw new RuntimeException("User is not verified");
        }
        if (!auth.isActive()) {
            throw new RuntimeException("User is not active");
        }
        otpService.verifyOTPbyEmail(request.getEmail(),request.getOTP());
        auth.setPassword(passwordEncoder.encode(request.getPassword()));
        repo.save(auth);
        return "Reset Password Success";
    }

    @Override
    public Auth getUser(String userID) {
        Auth auth=repo.findById(userID)
                .orElseThrow(
                        ()-> new RuntimeException("User not Found")
                );
        if(!auth.isVerified()){
            throw new RuntimeException("User is not verified");
        }
        if(!auth.isActive()){
            throw new RuntimeException("User is not Active");
        }
        return auth;

    }
}
