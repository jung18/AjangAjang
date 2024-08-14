package com.ajangajang.backend.chat.handler;

import com.ajangajang.backend.chat.repository.UserRoomRepository;
import com.ajangajang.backend.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Component
public class StompHandler implements ChannelInterceptor {

    private final UserRoomRepository userRoomRepository;
    private final ChatService chatService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        String userId = accessor.getFirstNativeHeader("userId");
        String roomId = accessor.getFirstNativeHeader("roomId");

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            if (userId != null) {
                chatService.checkPendingCalls(Long.valueOf(userId));
            }

        } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            if (userId != null && roomId != null) {
                updateLastReadTime(Long.valueOf(userId), Long.valueOf(roomId));
            }
        }

        return message;
    }

    private void updateLastReadTime(Long userId, Long roomId) {
        LocalDateTime currentTime = LocalDateTime.now();
        userRoomRepository.updateLastReadTime(userId, roomId, currentTime);
    }
}
