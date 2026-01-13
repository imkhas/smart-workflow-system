package com.workflow.system.controller;

import com.workflow.system.dto.response.RequestResponse;
import com.workflow.system.entity.Request;
import com.workflow.system.entity.User;
import com.workflow.system.entity.enums.RequestStatus;
import com.workflow.system.repository.RequestRepository;
import com.workflow.system.repository.UserRepository;
import com.workflow.system.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/statistics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getStatistics() {
        User currentUser = getCurrentUser();

        // Get all requests submitted by the current user
        List<Request> allRequests = requestRepository.findByRequesterId(currentUser.getId());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRequests", allRequests.size());

        stats.put("pendingRequests", allRequests.stream()
                .filter(r -> r.getStatus() == RequestStatus.PENDING).count());

        stats.put("approvedRequests", allRequests.stream()
                .filter(r -> r.getStatus() == RequestStatus.APPROVED).count());

        stats.put("rejectedRequests", allRequests.stream()
                .filter(r -> r.getStatus() == RequestStatus.REJECTED).count());

        // Get recent requests (last 5)
        stats.put("recentRequests", allRequests.stream()
                .sorted(Comparator.comparing(Request::getSubmittedAt).reversed())
                .limit(5)
                .map(RequestResponse::fromEntity)
                .collect(Collectors.toList()));

        return ResponseEntity.ok(stats);
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
