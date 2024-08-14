package com.ajangajang.backend.chat.service;

import com.ajangajang.backend.chat.dto.ChatMessageDto;
import com.ajangajang.backend.chat.entity.ChatMessage;
import com.ajangajang.backend.chat.entity.PendingCall;
import com.ajangajang.backend.chat.entity.Room;
import com.ajangajang.backend.chat.entity.UserRoom;
import com.ajangajang.backend.chat.repository.ChatMessageRepository;
import com.ajangajang.backend.chat.repository.PendingCallRepository;
import com.ajangajang.backend.chat.repository.RoomRepository;
import com.ajangajang.backend.chat.repository.UserRoomRepository;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final UserRoomRepository userRoomRepository;
    private final PendingCallRepository pendingCallRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void sendChatMessage(ChatMessageDto messageDto) {
        log.info("Service message type: {}", messageDto.getType());

        if (messageDto.getType() == ChatMessageDto.MessageType.CALL_REQUEST) {
            handleCallRequest(messageDto);
            return;
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

    private void handleCallRequest(ChatMessageDto messageDto) {
        Long roomId = Long.parseLong(messageDto.getRoomId());
        Long callerId = messageDto.getUserId();

        // 방에서 호출자의 ID를 제외한 다른 사용자의 ID를 가져옴
        Long receiverId = roomRepository.findRoomReceiver(roomId, callerId);

        boolean isReceiverConnected = userRoomRepository.isUserConnected(receiverId, roomId);

        if (isReceiverConnected) {
            // 만약 수신자가 연결되어 있으면, 즉시 통화 요청을 보냅니다.
            pendingCallRepository.deleteByRoomIdAndReceiverId(messageDto.getRoomId(), receiverId); // 기존의 대기 요청을 삭제합니다.

            // 메시징 템플릿을 통해 메시지를 보냅니다.
            messagingTemplate.convertAndSend("/sub/chat/" + messageDto.getRoomId(), messageDto);
        } else {
            // 수신자가 연결되어 있지 않으면, 통화 요청을 대기 요청으로 저장합니다.
            PendingCall pendingCall = new PendingCall();
            pendingCall.setRoomId(messageDto.getRoomId());
            pendingCall.setCallerId(callerId);
            pendingCall.setReceiverId(receiverId);
            pendingCall.setSessionId(messageDto.getSessionId());
            pendingCall.setTime(LocalDateTime.now());
            pendingCallRepository.save(pendingCall);
        }
    }


    public void checkPendingCalls(Long userId) {
        List<PendingCall> pendingCalls = pendingCallRepository.findByReceiverId(userId);
        for (PendingCall pendingCall : pendingCalls) {
            ChatMessageDto callRequest = new ChatMessageDto();
            callRequest.setType(ChatMessageDto.MessageType.CALL_REQUEST);
            callRequest.setRoomId(pendingCall.getRoomId());
            callRequest.setUserId(pendingCall.getCallerId());
            callRequest.setSessionId(pendingCall.getSessionId());
            callRequest.setTime(pendingCall.getTime());

            // Send the pending call request
            messagingTemplate.convertAndSend("/sub/chat/" + pendingCall.getRoomId(), callRequest);

            // Delete the pending call after sending
            pendingCallRepository.delete(pendingCall);
        }
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
