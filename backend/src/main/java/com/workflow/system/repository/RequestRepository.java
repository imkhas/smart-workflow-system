package com.workflow.system.repository;

import com.workflow.system.entity.Request;
import com.workflow.system.entity.User;
import com.workflow.system.entity.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long>, JpaSpecificationExecutor<Request> {

    List<Request> findByRequester(User requester);

    Page<Request> findByRequester(User requester, Pageable pageable);

    List<Request> findByRequesterId(Long requesterId);

    Page<Request> findByRequesterId(Long requesterId, Pageable pageable);

    List<Request> findByAssignedReviewerId(Long assignedReviewerId);

    List<Request> findByStatus(RequestStatus status);

    Page<Request> findByStatus(RequestStatus status, Pageable pageable);

    List<Request> findByRequesterIdAndStatus(Long requesterId, RequestStatus status);

    Page<Request> findByRequesterIdAndStatus(Long requesterId, RequestStatus status, Pageable pageable);

    @Query("SELECT r FROM Request r WHERE r.status = :status AND r.submittedAt < :deadline")
    List<Request> findOverdueRequests(@Param("status") RequestStatus status, @Param("deadline") LocalDateTime deadline);

    @Query("SELECT r FROM Request r WHERE " +
            "LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Request> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    Long countByRequesterId(Long requesterId);

    Long countByRequesterIdAndStatus(Long requesterId, RequestStatus status);
}
