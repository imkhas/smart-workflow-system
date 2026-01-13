package com.workflow.system.controller;

import com.workflow.system.dto.request.CreateCommentDTO;
import com.workflow.system.dto.response.CommentResponse;
import com.workflow.system.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests/{requestId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long requestId) {
        return ResponseEntity.ok(commentService.getComments(requestId));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long requestId,
            @Valid @RequestBody CreateCommentDTO dto) {
        return ResponseEntity.ok(commentService.addComment(requestId, dto));
    }
}
