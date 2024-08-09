package com.ajangajang.backend.chat.controller;

import com.ajangajang.backend.chat.dto.ChatMessageDto;
import com.ajangajang.backend.chat.entity.ChatMessage;
import com.ajangajang.backend.chat.service.ChatService;
import com.ajangajang.backend.chat.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/message")
    public void message(ChatMessageDto message) {
        chatService.sendChatMessage(message);
        Long roomId = Long.parseLong(message.getRoomId());
        roomService.updateLastMessage(roomId, message.getMessage());
        messagingTemplate.convertAndSend("/sub/chat/" + message.getRoomId(), message);
    }

    @GetMapping("/messages/{roomId}")
    public List<ChatMessageDto> getMessages(@PathVariable String roomId) {
        List<ChatMessage> messages = chatService.getChatMessagesByRoomId(roomId);

        // 엔티티를 DTO로 변환
        return messages.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ChatMessageDto convertToDto(ChatMessage chatMessage) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setType(ChatMessageDto.MessageType.TALK); // 기본적으로 TALK 타입을 설정. 필요시 다른 타입으로 설정할 수 있음.
        dto.setRoomId(chatMessage.getRoom().getId().toString());
        dto.setUserId(chatMessage.getUser().getId());
        dto.setMessage(chatMessage.getMessage());
        dto.setTime(chatMessage.getTime());

        return dto;
    }
}
