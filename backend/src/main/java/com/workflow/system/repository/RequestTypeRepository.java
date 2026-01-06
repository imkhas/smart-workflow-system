package com.workflow.system.repository;

import com.workflow.system.entity.RequestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RequestTypeRepository extends JpaRepository<RequestType, Long> {

    Optional<RequestType> findByName(String name);

    List<RequestType> findByActiveTrue();

    Boolean existsByName(String name);
}
