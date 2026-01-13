package com.workflow.system.service;

import com.workflow.system.entity.Notification;
import com.workflow.system.entity.User;
import com.workflow.system.repository.NotificationRepository;
import com.workflow.system.repository.UserRepository;
import com.workflow.system.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public void createNotification(User user, String message, Long relatedRequestId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setRelatedRequestId(relatedRequestId);
        notificationRepository.save(notification);
    }

    public List<Notification> getMyNotifications() {
        User currentUser = getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(currentUser);
    }

    public long getUnreadCount() {
        User currentUser = getCurrentUser();
        return notificationRepository.countByUserAndIsReadFalse(currentUser);
    }

    public void markAsRead(Long id) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead() {
        User currentUser = getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(currentUser);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
