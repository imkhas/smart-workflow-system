package com.workflow.system.dto.request;

import com.workflow.system.entity.enums.Priority;
import lombok.Data;

@Data
public class UpdateRequestDTO {
    private String title;
    private String description;
    private Priority priority;
}
