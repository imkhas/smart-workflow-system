package com.workflow.system.dto.response;

import com.workflow.system.entity.Request;
import com.workflow.system.entity.enums.Priority;
import com.workflow.system.entity.enums.RequestStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class RequestResponse {
    private Long id;
    private String requesterName;
    private String requestTypeName;
    private String workflowName;
    private String title;
    private String description;
    private RequestStatus status;
    private Priority priority;
    private Integer currentStep;
    private LocalDateTime submittedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private List<ApprovalLogResponse> approvalLogs;
    private List<AttachmentResponse> attachments;

    public static RequestResponse fromEntity(Request request) {
        RequestResponse response = new RequestResponse();
        response.setId(request.getId());
        response.setRequesterName(request.getRequester().getFullName());
        response.setRequestTypeName(request.getRequestType().getName());
        if (request.getWorkflow() != null) {
            response.setWorkflowName(request.getWorkflow().getName());
        }
        response.setTitle(request.getTitle());
        response.setDescription(request.getDescription());
        response.setStatus(request.getStatus());
        response.setPriority(request.getPriority());
        response.setCurrentStep(request.getCurrentStep());
        response.setSubmittedAt(request.getSubmittedAt());
        response.setCompletedAt(request.getCompletedAt());
        response.setCreatedAt(request.getCreatedAt());

        // Include approval logs
        if (request.getApprovalLogs() != null) {
            response.setApprovalLogs(
                    request.getApprovalLogs().stream()
                            .map(ApprovalLogResponse::fromEntity)
                            .collect(Collectors.toList()));
        }

        // Include attachments
        if (request.getAttachments() != null) {
            response.setAttachments(
                    request.getAttachments().stream()
                            .map(AttachmentResponse::fromEntity)
                            .collect(Collectors.toList()));
        }

        return response;
    }
}
