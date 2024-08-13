package com.ajangajang.backend.chat.repository;

import com.ajangajang.backend.chat.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByRoomId(String roomId);
    long countByRoomIdAndTimeAfterAndIsReadFalse(String roomId, LocalDateTime time);
    List<ChatMessage> findByRoomIdAndTimeBeforeAndIsReadFalse(String roomId, LocalDateTime time);
    long countByRoomIdAndTimeAfter(String roomId, LocalDateTime time);
}