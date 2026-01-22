package com.workflow.system.specification;

import com.workflow.system.entity.Request;
import com.workflow.system.entity.enums.Priority;
import com.workflow.system.entity.enums.RequestStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class RequestSpecification {

    public static Specification<Request> filterRequests(
            String keyword,
            RequestStatus status,
            Priority priority,
            Long requesterId,
            Long reviewerId,
            Long involvedUserId,
            LocalDateTime startDate,
            LocalDateTime endDate) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Keyword search in title and description
            if (keyword != null && !keyword.trim().isEmpty()) {
                String likePattern = "%" + keyword.toLowerCase() + "%";
                Predicate titleMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")), likePattern);
                Predicate descriptionMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")), likePattern);
                predicates.add(criteriaBuilder.or(titleMatch, descriptionMatch));
            }

            // Status filter
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            // Priority filter
            if (priority != null) {
                predicates.add(criteriaBuilder.equal(root.get("priority"), priority));
            }

            // Requester filter
            if (requesterId != null) {
                predicates.add(criteriaBuilder.equal(root.get("requester").get("id"), requesterId));
            }

            // Reviewer filter
            if (reviewerId != null) {
                predicates.add(criteriaBuilder.equal(root.get("assignedReviewer").get("id"), reviewerId));
            }

            // Involved user filter (requester OR reviewer)
            if (involvedUserId != null) {
                Predicate requesterMatch = criteriaBuilder.equal(root.get("requester").get("id"), involvedUserId);
                Predicate reviewerMatch = criteriaBuilder.equal(root.get("assignedReviewer").get("id"), involvedUserId);
                predicates.add(criteriaBuilder.or(requesterMatch, reviewerMatch));
            }

            // Date range filter (submitted date)
            if (startDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("submittedAt"), startDate));
            }

            if (endDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("submittedAt"), endDate));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
