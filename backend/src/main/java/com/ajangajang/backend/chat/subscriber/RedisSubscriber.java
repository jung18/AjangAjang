package com.ajangajang.backend.chat.subscriber;

import com.ajangajang.backend.chat.dto.MessageSubDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String messageBody = new String(message.getBody());
            MessageSubDto messageSubDto = objectMapper.readValue(messageBody, MessageSubDto.class);
            System.out.println(message.toString());
            // 메시지를 처리하는 로직을 추가합니다.
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}