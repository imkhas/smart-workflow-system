package com.workflow.system.controller;

import com.workflow.system.dto.response.MessageResponse;
import com.workflow.system.entity.TelegramConfig;
import com.workflow.system.entity.User;
import com.workflow.system.repository.TelegramConfigRepository;
import com.workflow.system.repository.UserRepository;
import com.workflow.system.security.UserDetailsImpl;
import com.workflow.system.service.TelegramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/telegram")
public class TelegramController {

    @Value("${telegram.bot.username:}")
    private String botUsername;

    @Autowired
    private TelegramConfigRepository telegramConfigRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TelegramService telegramService;

    @GetMapping("/config")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTelegramConfig() {
        User currentUser = getCurrentUser();
        Optional<TelegramConfig> config = telegramConfigRepository.findByUserId(currentUser.getId());

        if (config.isPresent()) {
            return ResponseEntity.ok(config.get());
        } else {
            // Return empty config
            TelegramConfig emptyConfig = new TelegramConfig();
            emptyConfig.setUser(currentUser);
            emptyConfig.setEnabled(false);
            return ResponseEntity.ok(emptyConfig);
        }
    }

    @PostMapping("/config")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> saveTelegramConfig(@RequestBody TelegramConfig configDTO) {
        User currentUser = getCurrentUser();

        Optional<TelegramConfig> existingConfig = telegramConfigRepository.findByUserId(currentUser.getId());

        TelegramConfig config;
        if (existingConfig.isPresent()) {
            config = existingConfig.get();
        } else {
            config = new TelegramConfig();
            config.setUser(currentUser);
        }

        config.setChatId(configDTO.getChatId());
        config.setEnabled(configDTO.isEnabled());

        telegramConfigRepository.save(config);

        return ResponseEntity.ok(new MessageResponse("Telegram configuration saved successfully"));
    }

    @PostMapping("/test")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> sendTestNotification(@RequestBody TelegramConfig configDTO) {
        try {
            telegramService.sendTestNotification(configDTO.getChatId());
            return ResponseEntity.ok(new MessageResponse("Test notification sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Failed to send test notification: " + e.getMessage()));
        }
    }

    @DeleteMapping("/disconnect")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> disconnectTelegram() {
        User currentUser = getCurrentUser();
        telegramConfigRepository.deleteByUserId(currentUser.getId());

        // Also clear the linking token to be clean
        currentUser.setTelegramLinkingToken(null);
        userRepository.save(currentUser);

        return ResponseEntity.ok(new MessageResponse("Telegram account disconnected successfully"));
    }

    @GetMapping("/get-link")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTelegramLink() {
        User currentUser = getCurrentUser();
        String token = java.util.UUID.randomUUID().toString();
        currentUser.setTelegramLinkingToken(token);
        userRepository.save(currentUser);

        String botLink = "https://t.me/" + botUsername + "?start=" + token;
        return ResponseEntity.ok(new MessageResponse(botLink));
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
