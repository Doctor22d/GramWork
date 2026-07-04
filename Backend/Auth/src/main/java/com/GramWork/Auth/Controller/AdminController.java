package com.GramWork.Auth.Controller;

import com.GramWork.Auth.DTO.AdminRequest;
import com.GramWork.Auth.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AuthService authService;
    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody AdminRequest request){
        try {
            String token=authService.AdminLogin(request);
            return ResponseEntity.ok(token);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
