package com.workflow.system.controller;

import com.workflow.system.entity.RequestType;
import com.workflow.system.repository.RequestTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/request-types")
public class RequestTypeController {

    @Autowired
    private RequestTypeRepository requestTypeRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RequestType>> getAllRequestTypes() {
        return ResponseEntity.ok(requestTypeRepository.findByActiveTrue());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RequestType> getRequestTypeById(@PathVariable Long id) {
        return requestTypeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
