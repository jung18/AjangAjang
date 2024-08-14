package com.ajangajang.backend.chat.handler;

import com.ajangajang.backend.chat.dto.ChatMessageDto;
import com.ajangajang.backend.chat.entity.PendingCall;
import com.ajangajang.backend.chat.repository.PendingCallRepository;
import com.ajangajang.backend.chat.repository.UserRoomRepository;
import com.ajangajang.backend.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Component
public class StompHandler implements ChannelInterceptor {

    private final UserRoomRepository userRoomRepository;
    private final PendingCallRepository pendingCallRepository; // Add this instead of ChatService
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        String userId = accessor.getFirstNativeHeader("userId");
        String roomId = accessor.getFirstNativeHeader("roomId");

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            if (userId != null) {
                checkPendingCalls(Long.valueOf(userId)); // Use this method instead of calling ChatService
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

    private void checkPendingCalls(Long userId) {
        List<PendingCall> pendingCalls = pendingCallRepository.findByReceiverId(userId);
        for (PendingCall pendingCall : pendingCalls) {
            // Handle the pending call logic directly here
            ChatMessageDto callRequest = new ChatMessageDto();
            callRequest.setType(ChatMessageDto.MessageType.CALL_REQUEST);
            callRequest.setRoomId(pendingCall.getRoomId());
            callRequest.setUserId(pendingCall.getCallerId());
            callRequest.setSessionId(pendingCall.getSessionId());
            callRequest.setTime(pendingCall.getTime());

            messagingTemplate.convertAndSend("/sub/chat/" + pendingCall.getRoomId(), callRequest);

            pendingCallRepository.delete(pendingCall);
        }
    }
}
