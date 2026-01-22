package com.workflow.system.dto.request;

import com.workflow.system.entity.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRequestDTO {
    private Long requestTypeId;

    private String customRequestType;

    private String assignedReviewerEmail;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;
}
