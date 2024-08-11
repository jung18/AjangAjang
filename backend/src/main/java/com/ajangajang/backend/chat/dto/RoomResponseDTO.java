package com.ajangajang.backend.chat.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class RoomResponseDTO {
    private Long id;
    private String name;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private List<UserRoomDTO> userRooms;
}
