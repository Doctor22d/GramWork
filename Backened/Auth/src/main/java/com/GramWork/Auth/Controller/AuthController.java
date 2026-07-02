package com.GramWork.Auth.Controller;

import com.GramWork.Auth.DTO.*;
import com.GramWork.Auth.Model.Auth;
import com.GramWork.Auth.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @GetMapping("/{userID}/get-user")
    public ResponseEntity<?> getUser(@PathVariable String userID){
        try{
            Auth auth=authService.getUser(userID);
            return ResponseEntity.ok(auth);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("An error occurred. Please try again.");
        }
    }
    @PostMapping("/register")
    public ResponseEntity<String> Register(@Valid @RequestBody RegisterRequest registerRequest){
        try{
            String res=authService.register(registerRequest);
            return ResponseEntity.ok(res);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage() != null && !e.getMessage().contains("Exception") ? e.getMessage() : "An error occurred. Please try again.");
        }
    }
    @PutMapping("/{userID}/sendOTP")
    public ResponseEntity<String> SendOtp(@PathVariable String userID){
        try{
            String auth=authService.SendOTP(userID);
            return ResponseEntity.ok(auth);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("An error occurred. Please try again.");
        }

    }
    @PutMapping("/{userID}/verifyOTP")
    public ResponseEntity<String> verifyOTP(@PathVariable String userID,@RequestBody OTPRequest request){
        try{
            String auth=authService.verifyOTP(userID,request);
            return ResponseEntity.ok(auth);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("An error occurred. Please try again.");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request){
        try{
            String res=authService.login(request);
            return ResponseEntity.ok(res);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage() != null && !e.getMessage().contains("Exception") ? e.getMessage() : "An error occurred. Please try again.");
        }
    }
    @PostMapping("/ResetPasswordMail")
    public ResponseEntity<String> ResetPasswordMail(@RequestBody ResetPasswordMailRequest request){
        try{
            String res=authService.resetPasswordMail(request);
            return ResponseEntity.ok(res);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("An error occurred. Please try again.");
        }
    }
    @PutMapping("/ResetPassword")
    public ResponseEntity<String> ResetPassword(@Valid @RequestBody ResetPasswordRequest request){
        try {
            String res=authService.resetPassword(request);
            return ResponseEntity.ok(res);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("An error occurred. Please try again.");
        }
    }
}
