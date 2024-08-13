package com.ajangajang.backend.chat.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {

    public enum MessageType {
        ENTER, TALK, QUIT
    }

    private MessageType type;   // 메시지 타입 (ENTER, TALK, QUIT 등)
    private String roomId;      // 방 번호
    private Long userId;        // 사용자 id
    private String message;     // 메시지
    private LocalDateTime time;        // 전송 시간
}
