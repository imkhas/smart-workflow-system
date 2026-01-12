package com.workflow.system.service;

import com.workflow.system.dto.request.ApprovalDTO;
import com.workflow.system.dto.response.RequestResponse;
import com.workflow.system.entity.*;
import com.workflow.system.entity.enums.ApprovalAction;
import com.workflow.system.entity.enums.RequestStatus;
import com.workflow.system.exception.ResourceNotFoundException;
import com.workflow.system.repository.*;
import com.workflow.system.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApprovalService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApprovalLogRepository approvalLogRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<RequestResponse> getPendingApprovals() {
        User currentUser = getCurrentUser();
        // Find requests where status is PENDING
        List<Request> pendingRequests = requestRepository.findByStatus(RequestStatus.PENDING);

        // Filter requests where the current user's role matches the required approver
        // role for the current step
        return pendingRequests.stream()
                .filter(request -> isApproverForRequest(currentUser, request))
                .map(RequestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private boolean isApproverForRequest(User user, Request request) {
        if (request.getWorkflow() == null || request.getCurrentStep() == null) {
            return false;
        }

        // 1-based step index from DB
        int currentStepIndex = request.getCurrentStep();

        // Find workflow step matching the current step order
        return request.getWorkflow().getSteps().stream()
                .filter(step -> step.getStepOrder() == currentStepIndex)
                .findFirst()
                .map(step -> step.getApproverRole().equals(user.getRole()))
                .orElse(false);
    }

    @Transactional
    public void approveRequest(Long requestId, ApprovalDTO dto) {
        User currentUser = getCurrentUser();
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        validateApprovalAccess(currentUser, request);

        // Create log entry
        createApprovalLog(request, currentUser, ApprovalAction.APPROVE, dto.getComments());

        // Check if there are more steps
        int currentStep = request.getCurrentStep();
        WorkflowStep nextStep = request.getWorkflow().getSteps().stream()
                .filter(step -> step.getStepOrder() > currentStep)
                .sorted(Comparator.comparingInt(WorkflowStep::getStepOrder))
                .findFirst()
                .orElse(null);

        if (nextStep != null) {
            // Move to next step
            request.setCurrentStep(nextStep.getStepOrder());
        } else {
            // No more steps, fully approved
            request.setStatus(RequestStatus.APPROVED);
            request.setCompletedAt(LocalDateTime.now());
        }

        requestRepository.save(request);
    }

    @Transactional
    public void rejectRequest(Long requestId, ApprovalDTO dto) {
        User currentUser = getCurrentUser();
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        validateApprovalAccess(currentUser, request);

        // Create log entry
        createApprovalLog(request, currentUser, ApprovalAction.REJECT, dto.getComments());

        // Update request status
        request.setStatus(RequestStatus.REJECTED);
        request.setCompletedAt(LocalDateTime.now());

        requestRepository.save(request);
    }

    private void validateApprovalAccess(User user, Request request) {
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Request is not pending approval");
        }

        if (!isApproverForRequest(user, request)) {
            throw new AccessDeniedException(
                    "You are not authorized to approve/reject this request at the current step");
        }
    }

    private void createApprovalLog(Request request, User approver, ApprovalAction action, String comments) {
        ApprovalLog log = new ApprovalLog();
        log.setRequest(request);
        log.setApprover(approver);
        log.setAction(action);
        log.setComments(comments);
        log.setStepNumber(request.getCurrentStep());
        log.setActionDate(LocalDateTime.now());
        approvalLogRepository.save(log);
    }

    public List<RequestResponse> getApprovalHistory() {
        User currentUser = getCurrentUser();
        List<ApprovalLog> logs = approvalLogRepository.findByApproverIdOrderByActionDateDesc(currentUser.getId());

        return logs.stream()
                .map(log -> RequestResponse.fromEntity(log.getRequest()))
                .distinct() // Remove duplicates if approved multiple times? (unlikely but safe)
                .collect(Collectors.toList());
    }
}
