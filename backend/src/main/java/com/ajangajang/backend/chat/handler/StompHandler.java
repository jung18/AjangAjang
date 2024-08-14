package com.ajangajang.backend.chat.handler;

import com.ajangajang.backend.chat.repository.UserRoomRepository;
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

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        String userId = accessor.getFirstNativeHeader("userId");
        String roomId = accessor.getFirstNativeHeader("roomId");
        // STOMP 명령어에 따라 처리
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            System.out.println("연결!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1");

        } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            System.out.println("종료!!!!!!!!!!!!!!!!!!!!!!");
            // 사용자가 WebSocket 연결을 종료할 때
            System.out.println(userId + " ::::: " + roomId);
            if (userId != null && roomId != null) {
                // lastReadTime 갱신
                updateLastReadTime(Long.valueOf(userId), Long.valueOf(roomId));
            }
        }

        return message;
    }

    private void updateLastReadTime(Long userId, Long roomId) {
        // 현재 시간을 lastReadTime으로 설정
        LocalDateTime currentTime = LocalDateTime.now();

        // UserRoom 엔티티의 lastReadTime 필드를 업데이트
        userRoomRepository.updateLastReadTime(userId, roomId, currentTime);
    }
}
