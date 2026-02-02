package com.quickconnect.controller;

import com.quickconnect.dto.MessageRequest;
import com.quickconnect.dto.MessageResponse;
import com.quickconnect.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8080"})
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(@RequestBody MessageRequest request) {
        MessageResponse response = messageService.sendMessage(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<MessageResponse>> getConversation(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String token) {
        List<MessageResponse> messages = messageService.getConversation(userId, token);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<MessageResponse>> getUnreadMessages(
            @RequestHeader("Authorization") String token) {
        List<MessageResponse> messages = messageService.getUnreadMessages(token);
        return ResponseEntity.ok(messages);
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long messageId) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload-voice")
    public ResponseEntity<String> uploadVoiceNote(@RequestParam("file") String audioData) {
        String url = messageService.uploadVoiceNote(audioData);
        return ResponseEntity.ok(url);
    }
}
