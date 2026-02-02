package com.quickconnect.controller;

import com.quickconnect.dto.AuthRequest;
import com.quickconnect.dto.AuthResponse;
import com.quickconnect.entity.User;
import com.quickconnect.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/web3-login")
    public ResponseEntity<AuthResponse> web3Login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.web3Login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<User> verify(@RequestHeader("Authorization") String token) {
        User user = authService.verifyToken(token);
        return ResponseEntity.ok(user);
    }
}
