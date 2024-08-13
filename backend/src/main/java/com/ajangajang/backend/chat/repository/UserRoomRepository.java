package com.ajangajang.backend.chat.repository;

import com.ajangajang.backend.chat.entity.UserRoom;
import com.ajangajang.backend.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoomRepository extends JpaRepository<UserRoom, Long> {

    // 특정 유저가 속한 모든 채팅방을 조회
    List<UserRoom> findByUser(User user);

    // 특정 유저와 특정 채팅방 간의 관계를 조회
    Optional<UserRoom> findByUserIdAndRoomId(Long userId, Long roomId);

    // 특정 유저와 특정 채팅방 간의 관계를 조회 및 존재 여부 확인
    boolean existsByUserIdAndRoomId(Long userId, Long roomId);

    // 특정 채팅방에 속한 모든 유저-방 관계를 조회
    List<UserRoom> findByRoomId(Long roomId);

    // 특정 유저의 특정 채팅방에서의 마지막 읽은 시간을 갱신
    default void updateLastReadTime(Long userId, Long roomId, LocalDateTime lastReadTime) {
        findByUserIdAndRoomId(userId, roomId).ifPresent(userRoom -> {
            userRoom.setLastReadTime(lastReadTime);
            save(userRoom);
        });
    }
}
