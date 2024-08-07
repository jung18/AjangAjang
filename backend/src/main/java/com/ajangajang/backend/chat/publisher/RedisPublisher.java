package com.ajangajang.backend.chat.publisher;

import com.ajangajang.backend.chat.dto.MessageSubDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RedisPublisher {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic topic;

    public void publish(MessageSubDto message) {
        System.out.println(message.toString());
        redisTemplate.convertAndSend(topic.getTopic(), message);
    }
}
