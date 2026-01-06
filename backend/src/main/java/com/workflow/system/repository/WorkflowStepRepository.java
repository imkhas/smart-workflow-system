package com.workflow.system.repository;

import com.workflow.system.entity.Workflow;
import com.workflow.system.entity.WorkflowStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowStepRepository extends JpaRepository<WorkflowStep, Long> {

    List<WorkflowStep> findByWorkflowOrderByStepOrderAsc(Workflow workflow);

    List<WorkflowStep> findByWorkflowIdOrderByStepOrderAsc(Long workflowId);
}
