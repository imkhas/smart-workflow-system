package com.workflow.system.service;

import com.workflow.system.entity.Request;
import com.workflow.system.entity.WorkflowStep;
import com.workflow.system.entity.enums.RequestStatus;
import com.workflow.system.repository.RequestRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class DeadlineService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private TelegramService telegramService;

    @Autowired
    private NotificationService notificationService;

    // Run every hour
    @Scheduled(cron = "0 0 * * * *")
    public void checkDeadlines() {
        log.info("Checking SLA deadlines for pending requests...");
        List<Request> pendingRequests = requestRepository.findByStatus(RequestStatus.PENDING);

        for (Request request : pendingRequests) {
            checkAndNotifyIfOverdue(request);
        }
    }

    private void checkAndNotifyIfOverdue(Request request) {
        if (request.getWorkflow() == null || request.getCurrentStep() == null
                || request.getCurrentStepStartedAt() == null) {
            return;
        }

        // Find the current workflow step
        WorkflowStep currentStep = request.getWorkflow().getSteps().stream()
                .filter(step -> step.getStepOrder().equals(request.getCurrentStep()))
                .findFirst()
                .orElse(null);

        if (currentStep == null || currentStep.getSlaHours() == null) {
            return;
        }

        LocalDateTime deadline = request.getCurrentStepStartedAt().plusHours(currentStep.getSlaHours());
        if (LocalDateTime.now().isAfter(deadline)) {
            log.info("Request #{} is overdue. Deadline was {}. Sending reminders.", request.getId(), deadline);
            sendReminders(request, currentStep);
        }
    }

    private void sendReminders(Request request, WorkflowStep step) {
        String message = String.format("⏰ *SLA Deadline Reminder*\n\n" +
                "Request #%d: \"%s\" is overdue!\n" +
                "Current Step: %s\n" +
                "Please review it as soon as possible.",
                request.getId(), request.getTitle(), step.getStepName());

        // Notify assigned reviewer if present
        if (request.getAssignedReviewer() != null) {
            telegramService.sendNotificationToUser(request.getAssignedReviewer(), message);
            notificationService.createNotification(
                    request.getAssignedReviewer(),
                    "Deadline Reminder: Request #" + request.getId() + " is overdue.",
                    request.getId());
        } else {
            // If no direct reviewer, we could notify all users with the required role
            // For now, let's log it or implement role-based notification if needed
            log.warn("Request #{} is overdue but has no direct assigned reviewer.", request.getId());
        }
    }
}
