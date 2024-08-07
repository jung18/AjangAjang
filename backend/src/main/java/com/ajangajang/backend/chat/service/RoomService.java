package com.ajangajang.backend.chat.service;

import com.ajangajang.backend.chat.entity.Room;
import com.ajangajang.backend.chat.entity.UserRoom;
import com.ajangajang.backend.chat.repository.RoomRepository;
import com.ajangajang.backend.chat.repository.UserRoomRepository;
import com.ajangajang.backend.user.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final UserRoomRepository userRoomRepository;

    public void updateLastMessage(Long roomId, String lastMessage) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
        room.setLastMessage(lastMessage);
        room.setLastMessageTime(LocalDateTime.now());
        roomRepository.save(room);
    }

    public List<Room> getUserRooms(User user) {
        List<UserRoom> userRooms = userRoomRepository.findByUser(user);
        return userRooms.stream()
                .map(UserRoom::getRoom)
                .collect(Collectors.toList());
    }
}