package com.ajangajang.backend.chat.controller;

import com.ajangajang.backend.chat.dto.RoomRequestDTO;
import com.ajangajang.backend.chat.dto.RoomResponseDTO;
import com.ajangajang.backend.chat.entity.Room;
import com.ajangajang.backend.chat.repository.RoomRepository;
import com.ajangajang.backend.chat.service.RoomService;
import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomRepository roomRepository;
    private final RoomService roomService;
    private final UserRepository userRepository;

    @PostMapping
    public RoomResponseDTO createRoom(@RequestBody RoomRequestDTO roomRequestDTO) {
        Room room = roomService.createRoom(
                roomRequestDTO.getName(),
                roomRequestDTO.getBoardId()  // 수정된 부분: boardId를 넘김
        );
        return roomService.getRoomResponseDTO(room);
    }

    @GetMapping("/myRooms")
    public List<RoomResponseDTO> getUserRooms(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        User user = userRepository.findByUsername(customOAuth2User.getUsername()).orElse(null);
        return roomService.getUserRooms(user);
    }

    @GetMapping
    public List<RoomResponseDTO> getAllRooms() {
        return roomService.getAllRooms();
    }
}
