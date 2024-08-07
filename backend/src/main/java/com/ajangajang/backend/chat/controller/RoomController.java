package com.ajangajang.backend.chat.controller;

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
    public Room createRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    @GetMapping("/myRooms")
    public List<Room> getUserRooms(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        User user = userRepository.findByUsername(customOAuth2User.getUsername()).orElse(null);
        return roomService.getUserRooms(user);
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
}
