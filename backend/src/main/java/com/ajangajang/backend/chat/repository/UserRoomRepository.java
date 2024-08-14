package com.ajangajang.backend.chat.repository;

import com.ajangajang.backend.chat.entity.UserRoom;
import com.ajangajang.backend.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // 특정 유저가 특정 방에 연결되어 있는지 확인하는 메서드 추가
    @Query("SELECT CASE WHEN COUNT(ur) > 0 THEN TRUE ELSE FALSE END FROM UserRoom ur WHERE ur.user.id = :userId AND ur.room.id = :roomId")
    boolean isUserConnected(@Param("userId") Long userId, @Param("roomId") Long roomId);

    // 특정 유저의 특정 채팅방에서의 마지막 읽은 시간을 갱신
    @Modifying
    @Query("UPDATE UserRoom ur SET ur.lastReadTime = :lastReadTime WHERE ur.user.id = :userId AND ur.room.id = :roomId")
    void updateLastReadTime(@Param("userId") Long userId, @Param("roomId") Long roomId, @Param("lastReadTime") LocalDateTime lastReadTime);
}
