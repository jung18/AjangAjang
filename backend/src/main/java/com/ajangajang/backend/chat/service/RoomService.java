package com.ajangajang.backend.chat.service;

import com.ajangajang.backend.chat.dto.RoomResponseDTO;
import com.ajangajang.backend.chat.dto.UserRoomDTO;
import com.ajangajang.backend.chat.entity.Room;
import com.ajangajang.backend.chat.entity.UserRoom;
import com.ajangajang.backend.chat.repository.RoomRepository;
import com.ajangajang.backend.chat.repository.UserRoomRepository;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import jakarta.transaction.Transactional;
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
    private final UserRepository userRepository;

    public Room createRoom(String name, Long creatorUserId, Long postOwnerId) {
        Room room = new Room();
        room.setName(name);

        User creator = userRepository.findById(creatorUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User postOwner = userRepository.findById(postOwnerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create UserRoom entities
        UserRoom creatorUserRoom = new UserRoom();
        creatorUserRoom.setUser(creator);
        creatorUserRoom.setRoom(room);

        UserRoom postOwnerUserRoom = new UserRoom();
        postOwnerUserRoom.setUser(postOwner);
        postOwnerUserRoom.setRoom(room);

        room.addUserRoom(creatorUserRoom);
        room.addUserRoom(postOwnerUserRoom);

        return roomRepository.save(room);
    }

    public RoomResponseDTO getRoomResponseDTO(Room room) {
        RoomResponseDTO dto = new RoomResponseDTO();
        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setLastMessage(room.getLastMessage());
        dto.setLastMessageTime(room.getLastMessageTime());

        List<UserRoomDTO> userRoomDTOs = room.getUserRooms().stream()
                .map(userRoom -> {
                    UserRoomDTO urDto = new UserRoomDTO();
                    urDto.setId(userRoom.getId());
                    urDto.setUserId(userRoom.getUser().getId());
                    urDto.setRoomId(userRoom.getRoom().getId());
                    return urDto;
                })
                .collect(Collectors.toList());

        dto.setUserRooms(userRoomDTOs);

        return dto;
    }

    public List<RoomResponseDTO> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return rooms.stream()
                .map(this::getRoomResponseDTO)
                .collect(Collectors.toList());
    }
    public void updateLastMessage(Long roomId, String lastMessage) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
        room.setLastMessage(lastMessage);
        room.setLastMessageTime(LocalDateTime.now());
        roomRepository.save(room);
    }

    public List<RoomResponseDTO> getUserRooms(User user) {
        List<UserRoom> userRooms = userRoomRepository.findByUser(user);
        List<Room> rooms = userRooms.stream()
                .map(UserRoom::getRoom)
                .collect(Collectors.toList());

        // Convert Rooms to RoomResponseDTO list
        return rooms.stream()
                .map(this::getRoomResponseDTO)
                .collect(Collectors.toList());
    }
}