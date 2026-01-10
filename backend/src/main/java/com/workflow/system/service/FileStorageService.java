package com.workflow.system.service;

import com.workflow.system.config.FileStorageConfig;
import com.workflow.system.entity.Attachment;
import com.workflow.system.entity.Request;
import com.workflow.system.entity.User;
import com.workflow.system.repository.AttachmentRepository;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    public FileStorageService(FileStorageConfig fileStorageConfig) {
        this.fileStorageLocation = Paths.get(fileStorageConfig.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory!", ex);
        }
    }

    public Attachment storeFile(MultipartFile file, Request request, User uploadedBy) {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        // Validate filename
        if (originalFilename.contains("..")) {
            throw new IllegalArgumentException("Invalid filename: " + originalFilename);
        }

        // Check file size (10MB max)
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 10MB");
        }

        // Validate file type (optional - add allowed extensions)
        String extension = FilenameUtils.getExtension(originalFilename);
        String[] allowedExtensions = {"pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png", "txt"};
        boolean isAllowed = false;
        for (String ext : allowedExtensions) {
            if (ext.equalsIgnoreCase(extension)) {
                isAllowed = true;
                break;
            }
        }
        if (!isAllowed) {
            throw new IllegalArgumentException("File type not allowed: " + extension);
        }

        try {
            // Generate unique filename
            String storedFilename = UUID.randomUUID().toString() + "." + extension;

            // Save file
            Path targetLocation = this.fileStorageLocation.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Create attachment record
            Attachment attachment = new Attachment();
            attachment.setRequest(request);
            attachment.setUploadedBy(uploadedBy);
            attachment.setOriginalFilename(originalFilename);
            attachment.setStoredFilename(storedFilename);
            attachment.setFilePath(targetLocation.toString());
            attachment.setContentType(file.getContentType());
            attachment.setFileSizeBytes(file.getSize());

            return attachmentRepository.save(attachment);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename, ex);
        }
    }

    public Path loadFileAsPath(String filename) {
        return this.fileStorageLocation.resolve(filename).normalize();
    }
}