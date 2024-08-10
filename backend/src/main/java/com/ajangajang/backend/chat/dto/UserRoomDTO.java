package com.ajangajang.backend.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRoomDTO {
    private Long id;
    private Long userId;
    private Long roomId;
}
