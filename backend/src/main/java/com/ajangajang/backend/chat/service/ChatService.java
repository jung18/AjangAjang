package com.ajangajang.backend.chat.service;

import com.ajangajang.backend.chat.dto.ChatMessageDto;
import com.ajangajang.backend.chat.entity.ChatMessage;
import com.ajangajang.backend.chat.entity.Room;
import com.ajangajang.backend.chat.repository.ChatMessageRepository;
import com.ajangajang.backend.chat.repository.RoomRepository;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatMessageRepository chatMessageRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public void sendChatMessage(ChatMessageDto messageDto) {
        Room room = roomRepository.findById(Long.parseLong(messageDto.getRoomId()))
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        User user = userRepository.findById(messageDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ChatMessage message = new ChatMessage();
        message.setRoom(room);
        message.setUser(user);
        message.setMessage(messageDto.getMessage());
        message.setTime(messageDto.getTime());

        chatMessageRepository.save(message);
    }

    public List<ChatMessage> getChatMessagesByRoomId(String roomId) {
        Room room = roomRepository.findById(Long.parseLong(roomId))
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        return chatMessageRepository.findByRoom(room);
    }
}
