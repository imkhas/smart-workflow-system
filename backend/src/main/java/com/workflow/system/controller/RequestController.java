package com.workflow.system.controller;

import com.workflow.system.dto.request.CreateRequestDTO;
import com.workflow.system.dto.request.UpdateRequestDTO;
import com.workflow.system.dto.response.MessageResponse;
import com.workflow.system.dto.response.RequestResponse;
import com.workflow.system.entity.Request;
import com.workflow.system.entity.enums.Priority;
import com.workflow.system.entity.enums.RequestStatus;
import com.workflow.system.repository.RequestRepository;
import com.workflow.system.service.RequestService;
import com.workflow.system.specification.RequestSpecification;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private RequestRepository requestRepository;

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

    @GetMapping("/{requestId}/attachments/{attachmentId}/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<org.springframework.core.io.Resource> downloadAttachment(
            @PathVariable Long requestId,
            @PathVariable Long attachmentId) {

        org.springframework.core.io.Resource resource = requestService.downloadAttachment(requestId, attachmentId);
        com.workflow.system.entity.Attachment attachment = requestService.getAttachmentMetadata(attachmentId);

        String contentType = attachment.getContentType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getOriginalFilename() + "\"")
                .body(resource);
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

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RequestResponse>> searchRequests(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Specification<Request> spec = RequestSpecification.filterRequests(
                keyword, status, priority, null, startDate, endDate);

        List<Request> requests = requestRepository.findAll(spec);
        return ResponseEntity.ok(
                requests.stream()
                        .map(RequestResponse::fromEntity)
                        .collect(Collectors.toList()));
    }
}
