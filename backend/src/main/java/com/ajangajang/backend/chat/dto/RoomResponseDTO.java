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
    private Long creatorUserId;
    private Long boardId;
    private double longitude;
    private double latitude;
    private String sellerAddress; // 판매글 주소 추가
    private long unreadCount;
    private LocalDateTime lastReadTime; // 이 필드를 추가합니다.
}