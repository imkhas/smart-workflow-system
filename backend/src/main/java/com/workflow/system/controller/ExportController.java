package com.workflow.system.controller;

import com.workflow.system.entity.Request;
import com.workflow.system.entity.enums.Priority;
import com.workflow.system.entity.enums.RequestStatus;
import com.workflow.system.repository.RequestRepository;
import com.workflow.system.service.ExportService;
import com.workflow.system.specification.RequestSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private ExportService exportService;

    @GetMapping("/requests/csv")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> exportRequestsToCSV(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Specification<Request> spec = RequestSpecification.filterRequests(
                keyword, status, priority, null, startDate, endDate);

        List<Request> requests = requestRepository.findAll(spec);
        String csv = exportService.exportRequestsToCSV(requests);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "requests_export.csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csv);
    }
}
