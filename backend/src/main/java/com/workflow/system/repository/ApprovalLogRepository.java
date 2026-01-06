package com.workflow.system.repository;

import com.workflow.system.entity.ApprovalLog;
import com.workflow.system.entity.Request;
import com.workflow.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalLogRepository extends JpaRepository<ApprovalLog, Long> {

    List<ApprovalLog> findByRequestOrderByActionDateDesc(Request request);

    List<ApprovalLog> findByRequestIdOrderByActionDateDesc(Long requestId);

    List<ApprovalLog> findByApproverOrderByActionDateDesc(User approver);

    List<ApprovalLog> findByApproverIdOrderByActionDateDesc(Long approverId);
}
