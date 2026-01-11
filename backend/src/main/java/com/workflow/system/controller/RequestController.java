package com.workflow.system.controller;

import com.workflow.system.dto.request.CreateRequestDTO;
import com.workflow.system.dto.request.UpdateRequestDTO;
import com.workflow.system.dto.response.MessageResponse;
import com.workflow.system.dto.response.RequestResponse;
import com.workflow.system.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RequestResponse> createRequest(
            @Valid @RequestBody CreateRequestDTO dto) {
        return ResponseEntity.ok(requestService.createRequest(dto));
    }

    @PostMapping("/{requestId}/attachments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> uploadAttachment(
            @PathVariable Long requestId,
            @RequestParam("file") MultipartFile file) {
        requestService.uploadAttachment(requestId, file);
        return ResponseEntity.ok(new MessageResponse("File uploaded successfully"));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RequestResponse>> getMyRequests() {
        return ResponseEntity.ok(requestService.getMyRequests());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RequestResponse> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RequestResponse> updateRequest(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRequestDTO dto) {
        return ResponseEntity.ok(requestService.updateRequest(id, dto));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RequestResponse> submitRequest(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.submitRequest(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.ok(new MessageResponse("Request deleted successfully"));
    }
}