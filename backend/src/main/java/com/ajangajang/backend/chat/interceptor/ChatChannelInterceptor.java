package com.ajangajang.backend.chat.interceptor;

import com.ajangajang.backend.chat.repository.UserRoomRepository;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ChatChannelInterceptor implements ChannelInterceptor {

    private final UserRoomRepository userRoomRepository;

    public ChatChannelInterceptor(UserRoomRepository userRoomRepository) {
        this.userRoomRepository = userRoomRepository;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String userId = accessor.getFirstNativeHeader("userId");
            String roomId = accessor.getFirstNativeHeader("roomId");

            // 사용자가 채팅방에 들어갈 때 lastReadTime 갱신
            updateLastReadTime(userId, roomId);

        } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            String userId = accessor.getUser().getName();
            String roomId = (String) accessor.getSessionAttributes().get("roomId");

            // 사용자가 채팅방에서 나갈 때 lastReadTime 갱신
            updateLastReadTime(userId, roomId);
        }

        return message;
    }

    private void updateLastReadTime(String userId, String roomId) {
        // 현재 시간을 lastReadTime으로 설정
        LocalDateTime currentTime = LocalDateTime.now();

        // UserRoom 엔티티의 lastReadTime 필드를 업데이트
        userRoomRepository.updateLastReadTime(Long.parseLong(userId), Long.parseLong(roomId), currentTime);
    }
}
