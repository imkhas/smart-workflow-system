package com.workflow.system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private Request request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @NotBlank(message = "Original filename is required")
    @Column(nullable = false)
    private String originalFilename;

    @NotBlank(message = "Stored filename is required")
    @Column(nullable = false, unique = true)
    private String storedFilename;

    @NotBlank(message = "File path is required")
    @Column(nullable = false)
    private String filePath;

    @Column(length = 100)
    private String contentType;

    @NotNull(message = "File size is required")
    @Column(nullable = false)
    private Long fileSizeBytes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
}
