package com.workflow.system.dto.response;

import com.workflow.system.entity.Comment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private String authorName;
    private Long authorId;
    private String content;
    private LocalDateTime createdAt;

    public static CommentResponse fromEntity(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setAuthorName(comment.getAuthor().getFullName());
        response.setAuthorId(comment.getAuthor().getId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        return response;
    }
}
