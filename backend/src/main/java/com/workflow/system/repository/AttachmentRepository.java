package com.workflow.system.repository;

import com.workflow.system.entity.Attachment;
import com.workflow.system.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByRequest(Request request);

    List<Attachment> findByRequestId(Long requestId);

    Optional<Attachment> findByStoredFilename(String storedFilename);

    void deleteByRequestId(Long requestId);
}
