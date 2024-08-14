package com.ajangajang.backend.chat.service;

import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.chat.dto.RoomResponseDTO;
import com.ajangajang.backend.chat.dto.UserRoomDTO;
import com.ajangajang.backend.chat.entity.ChatMessage;
import com.ajangajang.backend.chat.entity.Room;
import com.ajangajang.backend.chat.entity.UserRoom;
import com.ajangajang.backend.chat.repository.ChatMessageRepository;
import com.ajangajang.backend.chat.repository.RoomRepository;
import com.ajangajang.backend.chat.repository.UserRoomRepository;
import com.ajangajang.backend.user.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final UserRoomRepository userRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final BoardRepository boardRepository;

    @Transactional
    public Room createRoom(String name, Long boardId, User creator) {
        Room room = new Room();
        room.setName(name);
        room.setLastMessage("");
        room.setLastMessageTime(LocalDateTime.now());

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid board ID"));
        room.setBoard(board);

        UserRoom creatorUserRoom = new UserRoom();
        creatorUserRoom.setUser(creator);
        creatorUserRoom.setRoom(room);

        UserRoom postOwnerUserRoom = new UserRoom();
        postOwnerUserRoom.setUser(board.getWriter());
        postOwnerUserRoom.setRoom(room);

        room.addUserRoom(creatorUserRoom);
        room.addUserRoom(postOwnerUserRoom);

        roomRepository.save(room);
        userRoomRepository.save(creatorUserRoom);
        userRoomRepository.save(postOwnerUserRoom);

        return room;
    }

    @Transactional
    public void updateLastReadTime(Long roomId, Long userId) {
        UserRoom userRoom = userRoomRepository.findByUserIdAndRoomId(userId, roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID or user ID"));

        LocalDateTime lastReadTime = LocalDateTime.now();
        userRoom.setLastReadTime(lastReadTime);
        userRoomRepository.save(userRoom);

        List<ChatMessage> unreadMessages = chatMessageRepository.findByRoomIdAndTimeBeforeAndIsReadFalse(roomId.toString(), lastReadTime);
        unreadMessages.forEach(message -> message.setRead(true));
        chatMessageRepository.saveAll(unreadMessages);
    }

    @Transactional(readOnly = true)
    public RoomResponseDTO getUserRoomById(Long roomId, User user) {
        // 방과 사용자를 기준으로 UserRoom을 찾음
        UserRoom userRoom = userRoomRepository.findByUserIdAndRoomId(user.getId(), roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID or you do not have access to this room"));

        // 방 정보 가져오기
        Room room = userRoom.getRoom();

        // 해당 방의 RoomResponseDTO 반환
        return getRoomResponseDTO(room, user.getId());
    }

    @Transactional(readOnly = true)
    public RoomResponseDTO getRoomResponseDTO(Room room, Long userId) {
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

        User creatorUser = room.getUserRooms().stream()
                .filter(userRoom -> room.getBoard() != null && userRoom.getUser().getId().equals(room.getBoard().getWriter().getId()))
                .findFirst()
                .map(UserRoom::getUser)
                .orElse(null);
        dto.setCreatorUserId(creatorUser != null ? creatorUser.getId() : null);

        if (room.getBoard() != null) {
            dto.setLongitude(room.getBoard().getAddress().getLongitude());
            dto.setLatitude(room.getBoard().getAddress().getLatitude());
        }

        if (userId != null) {
            UserRoom userRoom = userRoomRepository.findByUserIdAndRoomId(userId, room.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid room ID or user ID"));

            LocalDateTime lastReadTime = userRoom.getLastReadTime();
            if (lastReadTime == null || lastReadTime.equals(LocalDateTime.MIN)) {
                lastReadTime = LocalDateTime.of(1970, 1, 1, 0, 0);
            } else {
                lastReadTime = lastReadTime.plusHours(9);
            }

            long unreadCount = chatMessageRepository.countByRoomIdAndTimeAfterAndIsReadFalse(room.getId().toString(), lastReadTime);
            dto.setUnreadCount(unreadCount);
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public List<RoomResponseDTO> getUserRooms(User user) {
        List<UserRoom> userRooms = userRoomRepository.findByUser(user);

        return userRooms.stream()
                .map(userRoom -> {
                    Room room = userRoom.getRoom();

                    LocalDateTime lastReadTime = userRoom.getLastReadTime();
                    if (lastReadTime == null) {
                        lastReadTime = LocalDateTime.of(1970, 1, 1, 0, 0);
                    } else {
                        lastReadTime = lastReadTime.plusHours(9);
                    }

                    long unreadCount = chatMessageRepository.countByRoomIdAndTimeAfterAndIsReadFalse(room.getId().toString(), lastReadTime);

                    RoomResponseDTO dto = getRoomResponseDTO(room, user.getId());
                    dto.setUnreadCount(unreadCount);
                    dto.setLastReadTime(lastReadTime);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoomResponseDTO> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return rooms.stream()
                .map(room -> getRoomResponseDTO(room, null))
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateLastMessage(Long roomId, String lastMessage) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
        room.setLastMessage(lastMessage);
        room.setLastMessageTime(LocalDateTime.now());
        roomRepository.save(room);
    }
}