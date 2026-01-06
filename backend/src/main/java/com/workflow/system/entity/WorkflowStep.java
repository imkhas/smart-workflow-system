package com.workflow.system.entity;

import com.workflow.system.entity.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_steps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private Workflow workflow;

    @Min(value = 1, message = "Step order must be at least 1")
    @Column(nullable = false)
    private Integer stepOrder;

    @NotBlank(message = "Step name is required")
    @Column(nullable = false, length = 100)
    private String stepName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role approverRole;

    @Min(value = 1, message = "SLA hours must be at least 1")
    @Column(nullable = false)
    private Integer slaHours;

    @Column(nullable = false)
    private Boolean required = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
