package com.quickconnect.service;

import com.quickconnect.dto.AuthRequest;
import com.quickconnect.dto.AuthResponse;
import com.quickconnect.entity.User;
import com.quickconnect.repository.UserRepository;
import com.quickconnect.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(AuthRequest request) {
        // Check if email already exists
        Optional<User> existingEmail = userRepository.findByEmail(request.getEmail());
        if (existingEmail.isPresent()) {
            throw new RuntimeException("Email already registered! Use a different email.");
        }

        // Check if username already exists
        Optional<User> existingUsername = userRepository.findByUsername(request.getUsername());
        if (existingUsername.isPresent()) {
            throw new RuntimeException("Username already taken! Choose a different username.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setWalletAddress(generateWalletAddress());
        user.setIsOnline(true);

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getId());

        return new AuthResponse(token, savedUser);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        user.setIsOnline(true);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token, user);
    }

    public AuthResponse web3Login(AuthRequest request) {
        String walletAddress = request.getWalletAddress();

        Optional<User> existingUser = userRepository.findByWalletAddress(walletAddress);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setIsOnline(true);
        } else {
            user = new User();
            user.setWalletAddress(walletAddress);
            user.setUsername("User_" + walletAddress.substring(0, 6));
            user.setIsOnline(true);
        }

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getId());

        return new AuthResponse(token, savedUser);
    }

    public User verifyToken(String token) {
        Long userId = jwtUtil.extractUserId(token);
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String generateWalletAddress() {
        return "0x" + System.nanoTime();
    }
}
