package com.workflow.system.repository;

import com.workflow.system.entity.TelegramConfig;
import com.workflow.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TelegramConfigRepository extends JpaRepository<TelegramConfig, Long> {

    Optional<TelegramConfig> findByUser(User user);

    Optional<TelegramConfig> findByUserId(Long userId);

    Optional<TelegramConfig> findByChatId(String chatId);

    Boolean existsByUserId(Long userId);

    Boolean existsByChatId(String chatId);
}
