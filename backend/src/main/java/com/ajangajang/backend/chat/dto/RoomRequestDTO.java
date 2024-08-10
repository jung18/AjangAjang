package com.ajangajang.backend.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomRequestDTO {
    private String name;
    private Long creatorUserId; // 채팅을 생성한 사용자 ID
    private Long postOwnerId;   // 게시물의 소유자 ID
}