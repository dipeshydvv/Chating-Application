package com.quickconnect.repository;

import com.quickconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByWalletAddress(String walletAddress);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    List<User> findByIsOnlineTrue();
}
