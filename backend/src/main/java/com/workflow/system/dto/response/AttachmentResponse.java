package com.workflow.system.dto.response;

import com.workflow.system.entity.Attachment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AttachmentResponse {
    private Long id;
    private String fileName;
    private String contentType;
    private Long size;
    private LocalDateTime uploadedAt;
    private String uploadedBy;

    public static AttachmentResponse fromEntity(Attachment attachment) {
        AttachmentResponse response = new AttachmentResponse();
        response.setId(attachment.getId());
        response.setFileName(attachment.getOriginalFilename());
        response.setContentType(attachment.getContentType());
        response.setSize(attachment.getFileSizeBytes());
        response.setUploadedAt(attachment.getUploadedAt());
        if (attachment.getUploadedBy() != null) {
            response.setUploadedBy(attachment.getUploadedBy().getFullName());
        }
        return response;
    }
}
