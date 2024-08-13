package com.ajangajang.backend.sms.model.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import java.time.Duration;

@Repository
@RequiredArgsConstructor
public class SmsCertificationRepository {

    private final String PREFIX = "sms:";
    private final int LIMIT_TIME = 3 * 60;

    private final StringRedisTemplate redisTemplate;

    public void createSmsCertification(String phone, String certificationNumber) {
        ValueOperations<String, String> value = redisTemplate.opsForValue();
        value.set(PREFIX + phone, certificationNumber, Duration.ofSeconds(LIMIT_TIME));
    }

    public String getSmsCertification(String phone) {
        ValueOperations<String, String> value = redisTemplate.opsForValue();
        return value.get(PREFIX + phone);
    }

    public void deleteSmsCertification(String phone) {
        redisTemplate.delete(PREFIX + phone);
    }

    public boolean existsSmsCertification(String phone) {
        return redisTemplate.hasKey(PREFIX + phone);
    }
}
