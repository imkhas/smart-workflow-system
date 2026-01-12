package com.workflow.system.dto.request;

import com.workflow.system.entity.enums.ApprovalAction;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApprovalDTO {
    @NotNull(message = "Action is required")
    private ApprovalAction action;

    private String comments;
}
