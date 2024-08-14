package com.ajangajang.backend.chat.repository;

import com.ajangajang.backend.chat.entity.PendingCall;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PendingCallRepository extends MongoRepository<PendingCall, String> {
    List<PendingCall> findByReceiverId(Long receiverId);
    void deleteByRoomIdAndReceiverId(String roomId, Long receiverId);
}
