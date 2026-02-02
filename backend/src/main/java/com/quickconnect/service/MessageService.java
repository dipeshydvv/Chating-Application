package com.quickconnect.service;

import com.quickconnect.dto.MessageRequest;
import com.quickconnect.dto.MessageResponse;
import com.quickconnect.entity.Message;
import com.quickconnect.entity.User;
import com.quickconnect.repository.MessageRepository;
import com.quickconnect.repository.UserRepository;
import com.quickconnect.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public MessageResponse sendMessage(MessageRequest request) {
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());
        message.setMessageType(Message.MessageType.valueOf(request.getMessageType()));

        if (request.getVoiceUrl() != null) {
            message.setVoiceUrl(request.getVoiceUrl());
            message.setVoiceDuration(request.getVoiceDuration());
        }

        if (request.getLatitude() != null && request.getLongitude() != null) {
            message.setLatitude(request.getLatitude());
            message.setLongitude(request.getLongitude());
        }

        Message savedMessage = messageRepository.save(message);
        return convertToResponse(savedMessage);
    }

    public List<MessageResponse> getConversation(Long userId, String token) {
        Long currentUserId = jwtUtil.extractUserId(token);
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Message> messages = messageRepository.findBySenderAndReceiverOrReceiverAndSenderOrderByCreatedAtDesc(
                currentUser, otherUser, otherUser, currentUser);

        return messages.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<MessageResponse> getUnreadMessages(String token) {
        Long userId = jwtUtil.extractUserId(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Message> messages = messageRepository.findByReceiverAndIsReadFalse(user);
        return messages.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsRead(true);
        messageRepository.save(message);
    }

    public String uploadVoiceNote(String audioData) {
        // In production, save to cloud storage (S3, GCS, etc.)
        // For now, return a mock URL
        return "https://storage.example.com/voice/" + System.nanoTime() + ".wav";
    }

    private MessageResponse convertToResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getSender().getId(),
                message.getReceiver().getId(),
                message.getContent(),
                message.getMessageType().toString(),
                message.getVoiceUrl(),
                message.getVoiceDuration(),
                message.getLatitude(),
                message.getLongitude(),
                message.getIsRead(),
                message.getCreatedAt()
        );
    }
}
