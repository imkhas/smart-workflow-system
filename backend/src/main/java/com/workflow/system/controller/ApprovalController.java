package com.workflow.system.controller;

import com.workflow.system.dto.request.ApprovalDTO;
import com.workflow.system.dto.request.BulkApprovalDTO;
import com.workflow.system.dto.response.MessageResponse;
import com.workflow.system.dto.response.RequestResponse;
import com.workflow.system.service.ApprovalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    @Autowired
    private ApprovalService approvalService;

    @GetMapping("/pending")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RequestResponse>> getPendingApprovals() {
        return ResponseEntity.ok(approvalService.getPendingApprovals());
    }

    @PostMapping("/{requestId}/approve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> approveRequest(
            @PathVariable Long requestId,
            @Valid @RequestBody ApprovalDTO dto) {
        approvalService.approveRequest(requestId, dto);
        return ResponseEntity.ok(new MessageResponse("Request approved successfully"));
    }

    @PostMapping("/{requestId}/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> rejectRequest(
            @PathVariable Long requestId,
            @Valid @RequestBody ApprovalDTO dto) {
        approvalService.rejectRequest(requestId, dto);
        return ResponseEntity.ok(new MessageResponse("Request rejected successfully"));
    }

    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RequestResponse>> getApprovalHistory() {
        return ResponseEntity.ok(approvalService.getApprovalHistory());
    }

    @PostMapping("/bulk/approve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> bulkApprove(@Valid @RequestBody BulkApprovalDTO dto) {
        int count = approvalService.bulkApprove(dto);
        return ResponseEntity.ok(new MessageResponse(count + " request(s) approved successfully"));
    }

    @PostMapping("/bulk/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> bulkReject(@Valid @RequestBody BulkApprovalDTO dto) {
        int count = approvalService.bulkReject(dto);
        return ResponseEntity.ok(new MessageResponse(count + " request(s) rejected successfully"));
    }
}
