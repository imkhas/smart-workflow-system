package com.workflow.system.service;

import com.workflow.system.entity.Request;
import com.workflow.system.entity.TelegramConfig;
import com.workflow.system.entity.User;
import com.workflow.system.repository.TelegramConfigRepository;
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

            if (messageText.equals("/start")) {
                sendMessage(chatId, "Welcome to Workflow System Bot!\n\n" +
                        "Your Chat ID is: " + chatId + "\n\n" +
                        "Please copy this Chat ID and paste it in your Telegram Settings page in the Workflow System.");
            } else if (messageText.equals("/help")) {
                sendMessage(chatId, "Available commands:\n" +
                        "/start - Get your Chat ID\n" +
                        "/help - Show this help message");
            }
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
                request.getRequestType().getName(),
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
                request.getRequestType().getName(),
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
