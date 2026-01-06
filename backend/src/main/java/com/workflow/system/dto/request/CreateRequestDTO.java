package com.workflow.system.dto.request;

import com.workflow.system.entity.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRequestDTO {
    @NotNull(message = "Request Type ID is required")
    private Long requestTypeId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;
}
