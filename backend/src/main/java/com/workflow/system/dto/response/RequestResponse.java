package com.workflow.system.dto.response;

import com.workflow.system.entity.Request;
import com.workflow.system.entity.enums.Priority;
import com.workflow.system.entity.enums.RequestStatus;
import lombok.Data;

import java.time.LocalDateTime;

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

    // We can add attachment summaries and logs separately or here if needed
    // For now keeping it simple for lists

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
        return response;
    }
}
