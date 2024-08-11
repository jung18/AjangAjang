package com.ajangajang.backend.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomRequestDTO {
    private String name;
    private Long boardId; // 연결된 게시물 ID
}
