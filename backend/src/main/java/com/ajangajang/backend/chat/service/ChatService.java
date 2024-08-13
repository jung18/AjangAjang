package com.ajangajang.backend.chat.service;

import com.ajangajang.backend.chat.dto.ChatMessageDto;
import com.ajangajang.backend.chat.entity.ChatMessage;
import com.ajangajang.backend.chat.entity.Room;
import com.ajangajang.backend.chat.entity.UserRoom;
import com.ajangajang.backend.chat.repository.ChatMessageRepository;
import com.ajangajang.backend.chat.repository.RoomRepository;
import com.ajangajang.backend.chat.repository.UserRoomRepository;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final UserRoomRepository userRoomRepository;

    public void sendChatMessage(ChatMessageDto messageDto) {
        // CALL_REQUEST 메시지는 저장하지 않기
        if (messageDto.getType() == ChatMessageDto.MessageType.CALL_REQUEST) {
            return; // 메시지 저장 넘김
        }
        Room room = roomRepository.findById(Long.parseLong(messageDto.getRoomId()))
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        User user = userRepository.findById(messageDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ChatMessage message = new ChatMessage();
        message.setRoomId(messageDto.getRoomId());
        message.setUserId(messageDto.getUserId());
        message.setMessage(messageDto.getMessage());
        message.setTime(LocalDateTime.now().plusHours(9));

        chatMessageRepository.save(message);
    }

    public void updateReadTime(ChatMessageDto message) {
        UserRoom userRoom = userRoomRepository.findByUserIdAndRoomId(message.getUserId(), Long.parseLong(message.getRoomId()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID or user ID"));

        LocalDateTime lastReadTime = LocalDateTime.now();
        userRoom.setLastReadTime(lastReadTime);
        userRoomRepository.save(userRoom);
    }

    public List<ChatMessage> getChatMessagesByRoomId(String roomId) {
        return chatMessageRepository.findByRoomId(roomId);
    }
}