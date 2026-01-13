package com.workflow.system.service;

import com.workflow.system.dto.request.CreateRequestDTO;
import com.workflow.system.dto.request.UpdateRequestDTO;
import com.workflow.system.dto.response.RequestResponse;
import com.workflow.system.entity.*;
import com.workflow.system.entity.enums.RequestStatus;
import com.workflow.system.exception.ResourceNotFoundException;
import com.workflow.system.repository.*;
import com.workflow.system.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private RequestTypeRepository requestTypeRepository;

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AttachmentRepository attachmentRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public RequestResponse createRequest(CreateRequestDTO dto) {
        User currentUser = getCurrentUser();

        RequestType requestType = requestTypeRepository.findById(dto.getRequestTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Request type not found"));

        // Find active workflow for this request type
        Workflow workflow = workflowRepository.findByRequestTypeIdAndActiveTrue(dto.getRequestTypeId())
                .orElse(null);

        Request request = new Request();
        request.setRequester(currentUser);
        request.setRequestType(requestType);
        request.setWorkflow(workflow);
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setPriority(dto.getPriority());
        request.setStatus(RequestStatus.DRAFT);
        request.setCurrentStep(0);

        Request savedRequest = requestRepository.save(request);
        return RequestResponse.fromEntity(savedRequest);
    }

    @Transactional
    public void uploadAttachment(Long requestId, MultipartFile file) {
        User currentUser = getCurrentUser();
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        // Check if user is the requester
        if (!request.getRequester().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only upload files to your own requests");
        }

        // Only allow uploads for DRAFT requests
        if (request.getStatus() != RequestStatus.DRAFT) {
            throw new IllegalStateException("Cannot upload files to submitted requests");
        }

        fileStorageService.storeFile(file, request, currentUser);
    }

    public List<RequestResponse> getMyRequests() {
        User currentUser = getCurrentUser();
        List<Request> requests = requestRepository.findByRequesterId(currentUser.getId());
        return requests.stream()
                .map(RequestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public RequestResponse getRequestById(Long id) {
        User currentUser = getCurrentUser();
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        // Check access rights
        if (!request.getRequester().getId().equals(currentUser.getId())
                && !hasApprovalRights(currentUser, request)) {
            throw new AccessDeniedException("You don't have permission to view this request");
        }

        return RequestResponse.fromEntity(request);
    }

    @Transactional
    public RequestResponse updateRequest(Long id, UpdateRequestDTO dto) {
        User currentUser = getCurrentUser();
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        // Only requester can update
        if (!request.getRequester().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only update your own requests");
        }

        // Only DRAFT requests can be updated
        if (request.getStatus() != RequestStatus.DRAFT) {
            throw new IllegalStateException("Cannot update submitted requests");
        }

        if (dto.getTitle() != null)
            request.setTitle(dto.getTitle());
        if (dto.getDescription() != null)
            request.setDescription(dto.getDescription());
        if (dto.getPriority() != null)
            request.setPriority(dto.getPriority());

        Request updatedRequest = requestRepository.save(request);
        return RequestResponse.fromEntity(updatedRequest);
    }

    @Transactional
    public RequestResponse submitRequest(Long id) {
        User currentUser = getCurrentUser();
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        // Only requester can submit
        if (!request.getRequester().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only submit your own requests");
        }

        // Must be in DRAFT status
        if (request.getStatus() != RequestStatus.DRAFT) {
            throw new IllegalStateException("Request is already submitted");
        }

        // Check if workflow exists
        if (request.getWorkflow() == null) {
            throw new IllegalStateException("No workflow configured for this request type");
        }

        request.setStatus(RequestStatus.PENDING);
        request.setSubmittedAt(LocalDateTime.now());
        request.setCurrentStep(1); // Move to first approval step

        Request submittedRequest = requestRepository.save(request);
        return RequestResponse.fromEntity(submittedRequest);
    }

    @Transactional
    public void deleteRequest(Long id) {
        User currentUser = getCurrentUser();
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        // Only requester can delete and only DRAFT requests
        if (!request.getRequester().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only delete your own requests");
        }

        if (request.getStatus() != RequestStatus.DRAFT) {
            throw new IllegalStateException("Cannot delete submitted requests");
        }

        requestRepository.delete(request);
    }

    public org.springframework.core.io.Resource downloadAttachment(Long requestId, Long attachmentId) {
        User currentUser = getCurrentUser();
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        // Check view access rights
        if (!request.getRequester().getId().equals(currentUser.getId())
                && !hasApprovalRights(currentUser, request)) {
            throw new AccessDeniedException("You don't have permission to access attachments for this request");
        }

        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));

        if (!attachment.getRequest().getId().equals(requestId)) {
            throw new IllegalArgumentException("Attachment does not belong to the specified request");
        }

        return fileStorageService.loadFileAsResource(attachment.getStoredFilename());
    }

    public Attachment getAttachmentMetadata(Long attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));
    }

    private boolean hasApprovalRights(User user, Request request) {
        // Admins can view all
        if (user.getRole().name().equals("ADMIN")) {
            return true;
        }

        // Managers can view requests in their approval workflow
        if (user.getRole().name().equals("MANAGER") && request.getWorkflow() != null) {
            return request.getWorkflow().getSteps().stream()
                    .anyMatch(step -> step.getApproverRole().equals(user.getRole()));
        }

        return false;
    }
}