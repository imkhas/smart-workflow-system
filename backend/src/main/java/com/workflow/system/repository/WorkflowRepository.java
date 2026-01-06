package com.workflow.system.repository;

import com.workflow.system.entity.RequestType;
import com.workflow.system.entity.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long> {

    List<Workflow> findByRequestType(RequestType requestType);

    List<Workflow> findByRequestTypeId(Long requestTypeId);

    List<Workflow> findByActiveTrue();

    Optional<Workflow> findByRequestTypeIdAndActiveTrue(Long requestTypeId);
}
