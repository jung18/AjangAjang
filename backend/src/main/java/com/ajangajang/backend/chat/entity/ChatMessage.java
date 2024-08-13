package com.ajangajang.backend.chat.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Document(collection = "chat_messages")
@Getter
@Setter
public class ChatMessage {
    @Id
    private String id;

    private String roomId;
    private Long userId;
    private String message;
    private LocalDateTime time;
    private boolean isRead = false;
}