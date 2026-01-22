package com.workflow.system.service;

import com.workflow.system.entity.Request;
import com.workflow.system.entity.TelegramConfig;
import com.workflow.system.entity.User;
import com.workflow.system.repository.TelegramConfigRepository;
import com.workflow.system.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.Optional;

@Slf4j
@Service
public class TelegramService extends TelegramLongPollingBot {

    @Value("${telegram.bot.token:}")
    private String botToken;

    @Value("${telegram.bot.username:}")
    private String botUsername;

    @Autowired
    private TelegramConfigRepository telegramConfigRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();

            log.info("Telegram message received from chatId {}: {}", chatId, messageText);

            if (messageText.startsWith("/start")) {
                String[] parts = messageText.split(" ");
                if (parts.length > 1) {
                    // Deep linking with token
                    String token = parts[1];
                    log.info("Received /start with token: {}", token);
                    handleLinking(chatId, token);
                } else {
                    sendMessage(chatId, "Welcome to Workflow System Bot!\n\n" +
                            "To connect your account, please click the 'Connect' button on the Telegram Settings page in the web application.");
                }
            } else if (messageText.equals("/help")) {
                sendMessage(chatId, "Available commands:\n" +
                        "/start - Start the bot\n" +
                        "/help - Show this help message");
            }
        }
    }

    private void handleLinking(long chatId, String token) {
        log.info("Attempting to link chatId {} with token {}", chatId, token);
        Optional<User> userOpt = userRepository.findByTelegramLinkingToken(token);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            log.info("Found user for token: {}", user.getEmail());

            // Find or create config
            TelegramConfig config = telegramConfigRepository.findByUserId(user.getId())
                    .orElse(new TelegramConfig());

            config.setUser(user);
            config.setChatId(String.valueOf(chatId));
            config.setEnabled(true);
            telegramConfigRepository.save(config);
            log.info("Telegram config saved for user {}", user.getEmail());

            // Clear token
            user.setTelegramLinkingToken(null);
            userRepository.save(user);
            log.info("Telegram linking token cleared for user {}", user.getEmail());

            sendMessage(chatId, "✅ *Account Connected Successfully!*\n\n" +
                    "Hello " + user.getFullName() + ", your Telegram is now linked to the Workflow System.\n" +
                    "You will receive notifications here.");
        } else {
            log.warn("Invalid linking token: {}", token);
            sendMessage(chatId, "❌ *Link Expired or Invalid*\n\n" +
                    "This connection link is no longer valid. Please generate a new one from the Telegram Settings page.");
        }
    }

    /**
     * Send a notification to a user via Telegram
     */
    public void sendNotificationToUser(User user, String message) {
        Optional<TelegramConfig> configOpt = telegramConfigRepository.findByUserId(user.getId());

        if (configOpt.isPresent() && configOpt.get().isEnabled()) {
            TelegramConfig config = configOpt.get();
            sendMessage(Long.parseLong(config.getChatId()), message);
        }
    }

    /**
     * Notify user when their request is submitted
     */
    public void notifyRequestSubmitted(Request request) {
        String message = String.format(
                "✅ *Request Submitted*\n\n" +
                        "Request ID: #%d\n" +
                        "Title: %s\n" +
                        "Type: %s\n" +
                        "Priority: %s\n" +
                        "Status: %s\n\n" +
                        "Your request has been submitted for approval.",
                request.getId(),
                request.getTitle(),
                request.getRequestType() != null ? request.getRequestType().getName() : request.getCustomRequestType(),
                request.getPriority(),
                request.getStatus());
        sendNotificationToUser(request.getRequester(), message);
    }

    /**
     * Notify user when their request is approved
     */
    public void notifyRequestApproved(Request request, String approverName, String comments) {
        String message = String.format(
                "✅ *Request Approved*\n\n" +
                        "Request ID: #%d\n" +
                        "Title: %s\n" +
                        "Approved by: %s\n" +
                        "Comments: %s\n\n" +
                        "Your request has been approved!",
                request.getId(),
                request.getTitle(),
                approverName,
                comments != null ? comments : "No comments");
        sendNotificationToUser(request.getRequester(), message);
    }

    /**
     * Notify user when their request is rejected
     */
    public void notifyRequestRejected(Request request, String approverName, String comments) {
        String message = String.format(
                "❌ *Request Rejected*\n\n" +
                        "Request ID: #%d\n" +
                        "Title: %s\n" +
                        "Rejected by: %s\n" +
                        "Reason: %s\n\n" +
                        "Please review the comments and resubmit if needed.",
                request.getId(),
                request.getTitle(),
                approverName,
                comments != null ? comments : "No reason provided");
        sendNotificationToUser(request.getRequester(), message);
    }

    /**
     * Notify approver when a request needs their approval
     */
    public void notifyApproverPendingRequest(User approver, Request request) {
        String message = String.format(
                "🔔 *New Request Awaiting Your Approval*\n\n" +
                        "Request ID: #%d\n" +
                        "Title: %s\n" +
                        "Requester: %s\n" +
                        "Type: %s\n" +
                        "Priority: %s\n\n" +
                        "Please review and approve/reject this request.",
                request.getId(),
                request.getTitle(),
                request.getRequester().getFullName(),
                request.getRequestType() != null ? request.getRequestType().getName() : request.getCustomRequestType(),
                request.getPriority());
        sendNotificationToUser(approver, message);
    }

    /**
     * Send a test notification
     */
    public void sendTestNotification(String chatId) {
        sendMessage(Long.parseLong(chatId),
                "🎉 *Test Notification*\n\n" +
                        "Your Telegram notifications are working correctly!\n" +
                        "You will now receive updates about your workflow requests.");
    }

    /**
     * Helper method to send a message
     */
    private void sendMessage(long chatId, String text) {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(text);
        message.enableMarkdown(true);

        try {
            execute(message);
            log.info("Telegram message sent to chatId: {}", chatId);
        } catch (TelegramApiException e) {
            log.error("Failed to send Telegram message to chatId: {}", chatId, e);
        }
    }
}
