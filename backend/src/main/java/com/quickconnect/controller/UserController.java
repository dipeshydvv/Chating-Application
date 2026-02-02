package com.quickconnect.controller;

import com.quickconnect.entity.User;
import com.quickconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080", "https://quick-connect-chat.netlify.app"})
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * Get all registered users
     */
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get user by email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get user by username
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get online users
     */
    @GetMapping("/online")
    public ResponseEntity<List<User>> getOnlineUsers() {
        List<User> users = userRepository.findByIsOnlineTrue();
        return ResponseEntity.ok(users);
    }

    /**
     * Update user
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            if (userDetails.getUsername() != null) {
                user.setUsername(userDetails.getUsername());
            }
            if (userDetails.getAvatar() != null) {
                user.setAvatar(userDetails.getAvatar());
            }
            if (userDetails.getBio() != null) {
                user.setBio(userDetails.getBio());
            }
            if (userDetails.getInstagramUrl() != null) {
                user.setInstagramUrl(userDetails.getInstagramUrl());
            }
            if (userDetails.getLatitude() != null) {
                user.setLatitude(userDetails.getLatitude());
            }
            if (userDetails.getLongitude() != null) {
                user.setLongitude(userDetails.getLongitude());
            }
            if (userDetails.getIsOnline() != null) {
                user.setIsOnline(userDetails.getIsOnline());
            }
            
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }
        
        return ResponseEntity.notFound().build();
    }

    /**
     * Delete user
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Search users by username
     */
    @GetMapping("/search/{query}")
    public ResponseEntity<List<User>> searchUsers(@PathVariable String query) {
        // This is a simple search - you can enhance it with more complex queries
        List<User> allUsers = userRepository.findAll();
        List<User> results = allUsers.stream()
                .filter(u -> u.getUsername() != null && u.getUsername().toLowerCase().contains(query.toLowerCase()))
                .toList();
        return ResponseEntity.ok(results);
    }
}
