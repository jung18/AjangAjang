package com.ajangajang.backend.chat.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "pending_calls")
@Getter
@Setter
public class PendingCall {
    @Id
    private String id;
    private String roomId;
    private Long callerId;
    private Long receiverId;
    private String sessionId;
    private LocalDateTime time;
}
