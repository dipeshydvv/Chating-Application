package com.quickconnect.repository;

import com.quickconnect.entity.Message;
import com.quickconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiverOrReceiverAndSenderOrderByCreatedAtDesc(
            User sender1, User receiver1, User sender2, User receiver2);
    
    List<Message> findByReceiverAndIsReadFalse(User receiver);
}
