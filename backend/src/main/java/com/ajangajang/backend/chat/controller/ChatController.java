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
    public List<ChatMessage> getMessages(@PathVariable String roomId) { // roomId를 String으로 처리
        return chatService.getChatMessagesByRoomId(roomId);
    }
}
