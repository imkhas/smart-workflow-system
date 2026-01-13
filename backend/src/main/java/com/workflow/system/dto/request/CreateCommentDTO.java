package com.workflow.system.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCommentDTO {
    @NotBlank(message = "Comment content is required")
    private String content;
}
