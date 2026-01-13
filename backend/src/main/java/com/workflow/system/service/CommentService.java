package com.workflow.system.service;

import com.workflow.system.dto.request.CreateCommentDTO;
import com.workflow.system.dto.response.CommentResponse;
import com.workflow.system.entity.Comment;
import com.workflow.system.entity.Request;
import com.workflow.system.entity.User;
import com.workflow.system.exception.ResourceNotFoundException;
import com.workflow.system.repository.CommentRepository;
import com.workflow.system.repository.RequestRepository;
import com.workflow.system.repository.UserRepository;
import com.workflow.system.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<CommentResponse> getComments(Long requestId) {
        User currentUser = getCurrentUser();
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!canViewRequest(currentUser, request)) {
            throw new AccessDeniedException("You don't have permission to view comments for this request");
        }

        return commentRepository.findByRequestIdOrderByCreatedAtAsc(requestId).stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse addComment(Long requestId, CreateCommentDTO dto) {
        User currentUser = getCurrentUser();
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!canViewRequest(currentUser, request)) {
            throw new AccessDeniedException("You don't have permission to comment on this request");
        }

        Comment comment = new Comment();
        comment.setRequest(request);
        comment.setAuthor(currentUser);
        comment.setContent(dto.getContent());
        Comment savedComment = commentRepository.save(comment);

        // Notify relevant parties
        notifyAboutComment(request, currentUser, dto.getContent());

        return CommentResponse.fromEntity(savedComment);
    }

    private void notifyAboutComment(Request request, User commenter, String content) {
        // If owner comments, notify approver (if pending)
        // If approver comments, notify owner

        // Simple logic: Always notify owner if someone else comments
        if (!request.getRequester().getId().equals(commenter.getId())) {
            notificationService.createNotification(
                    request.getRequester(),
                    "💬 New comment on request '" + request.getTitle() + "' by " + commenter.getFullName(),
                    request.getId());
        }
    }

    private boolean canViewRequest(User user, Request request) {
        if (user.getRole().name().equals("ADMIN"))
            return true;
        if (request.getRequester().getId().equals(user.getId()))
            return true;

        // Managers can view if they are part of workflow
        if (user.getRole().name().equals("MANAGER") && request.getWorkflow() != null) {
            return request.getWorkflow().getSteps().stream()
                    .anyMatch(step -> step.getApproverRole().equals(user.getRole()));
        }
        return false;
    }
}
