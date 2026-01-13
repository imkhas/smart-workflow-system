package com.workflow.system.dto.response;

import com.workflow.system.entity.ApprovalLog;
import com.workflow.system.entity.enums.ApprovalAction;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApprovalLogResponse {
    private Long id;
    private String approverName;
    private ApprovalAction action;
    private String comments;
    private Integer stepNumber;
    private LocalDateTime actionDate;

    public static ApprovalLogResponse fromEntity(ApprovalLog log) {
        ApprovalLogResponse response = new ApprovalLogResponse();
        response.setId(log.getId());
        response.setApproverName(log.getApprover().getFullName());
        response.setAction(log.getAction());
        response.setComments(log.getComments());
        // Get step number from workflow step if available
        if (log.getWorkflowStep() != null) {
            response.setStepNumber(log.getWorkflowStep().getStepOrder());
        }
        response.setActionDate(log.getActionDate());
        return response;
    }
}
