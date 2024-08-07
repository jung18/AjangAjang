package com.ajangajang.backend.chat.repository;

import com.ajangajang.backend.chat.entity.ChatMessage;
import com.ajangajang.backend.chat.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRoom(Room room);
}
