package com.GramWork.Auth.Service;

import com.GramWork.Auth.DTO.*;
import com.GramWork.Auth.Model.Auth;

public interface AuthService {
    String register(RegisterRequest registerRequest);

    String SendOTP(String userID);

    String verifyOTP(String userID, OTPRequest request);
    String login(LoginRequest request);

    String resetPasswordMail(ResetPasswordMailRequest request);

    String resetPassword(ResetPasswordRequest request);

    Auth getUser(String userID);
}
