package com.ajangajang.backend.chat.controller;

import com.ajangajang.backend.chat.dto.RoomRequestDTO;
import com.ajangajang.backend.chat.dto.RoomResponseDTO;
import com.ajangajang.backend.chat.dto.UserRoomDTO;
import com.ajangajang.backend.chat.entity.Room;
import com.ajangajang.backend.chat.service.RoomService;
import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class RoomController {
    private static final Logger log = LoggerFactory.getLogger(RoomController.class);
    private final RoomService roomService;
    private final UserRepository userRepository;

    @PostMapping
    public RoomResponseDTO createRoom(@RequestBody RoomRequestDTO roomRequestDTO,
                                      @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        // 현재 소셜 로그인된 유저를 가져옴
        User creatorUser = userRepository.findByUsername(customOAuth2User.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 채팅방 생성
        Room room = roomService.createRoom(
                roomRequestDTO.getName(),
                roomRequestDTO.getBoardId(),
                creatorUser
        );

        // 방 생성 후 RoomResponseDTO 반환 시 userId를 함께 전달
        return roomService.getRoomResponseDTO(room, creatorUser.getId());
    }

    @GetMapping("/myRooms")
    public List<RoomResponseDTO> getUserRooms(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        User user = userRepository.findByUsername(customOAuth2User.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return roomService.getUserRooms(user);
    }

    @GetMapping("/myRooms/{roomId}")
    public RoomResponseDTO getUserRoomById(@PathVariable Long roomId,
                                           @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        log.info("/myRooms/{roomId} 진입");
        log.info("roomId: {}", roomId);
        User user = userRepository.findByUsername(customOAuth2User.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 해당 사용자가 해당 roomId에 접근할 수 있는지 확인
        RoomResponseDTO roomResponseDTO = roomService.getUserRoomById(roomId, user);

        // 예외 처리: 만약 사용자가 이 방에 속하지 않으면 예외를 던짐
        if (roomResponseDTO == null) {
            throw new RuntimeException("Room not found or you do not have access to this room");
        }

        log.info(roomResponseDTO.getUserRooms().get(0).getUserId().toString());
        return roomResponseDTO;
    }

    @GetMapping
    public List<RoomResponseDTO> getAllRooms() {
        return roomService.getAllRooms();
    }

    @PostMapping("/{roomId}/read")
    public void updateLastReadTime(@PathVariable Long roomId,
                                   @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        User user = userRepository.findByUsername(customOAuth2User.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        roomService.updateLastReadTime(roomId, user.getId());
    }
}
