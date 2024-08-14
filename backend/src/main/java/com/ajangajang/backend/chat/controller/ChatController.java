package com.ajangajang.backend.chat.controller;

import com.ajangajang.backend.chat.dto.ChatMessageDto;
import com.ajangajang.backend.chat.entity.ChatMessage;
import com.ajangajang.backend.chat.service.ChatService;
import com.ajangajang.backend.chat.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/message")
    public void message(ChatMessageDto message) {
        log.info("Controller message type = {}", message.toString());
        log.info("message.getType() == ChatMessageDto.MessageType.CALL_REQUEST => {}", message.getType() == ChatMessageDto.MessageType.CALL_REQUEST);
        // CALL_REQUEST 왔을 때,
        if (message.getType() == ChatMessageDto.MessageType.CALL_REQUEST) {
            log.info("Processing CALL_REQUEST message: {}", message);
            messagingTemplate.convertAndSend("/sub/chat/" + message.getRoomId(), message);
            return; // 추가 작업을 하지 않고 종료합니다.
        }
        chatService.sendChatMessage(message);
        chatService.updateReadTime(message);
        Long roomId = Long.parseLong(message.getRoomId());
        System.out.println(message.getTime());
        roomService.updateLastMessage(roomId, message.getMessage());
        messagingTemplate.convertAndSend("/sub/chat/" + message.getRoomId(), message);
    }

    @GetMapping("/messages/{roomId}")
    public List<ChatMessageDto> getMessages(@PathVariable String roomId) {
        List<ChatMessage> messages = chatService.getChatMessagesByRoomId(roomId);

        return messages.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private ChatMessageDto convertToDto(ChatMessage chatMessage) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setType(ChatMessageDto.MessageType.TALK);
        dto.setRoomId(chatMessage.getRoomId());
        dto.setUserId(chatMessage.getUserId());
        dto.setMessage(chatMessage.getMessage());
        dto.setTime(chatMessage.getTime());

        return dto;
    }
}