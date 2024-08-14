package com.ajangajang.backend.chat.repository;

import com.ajangajang.backend.chat.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // 특정 채팅방의 현재 참여자가 아닌 사용자를 찾는 커스텀 쿼리
    @Query("SELECT ur.user.id FROM UserRoom ur WHERE ur.room.id = :roomId AND ur.user.id <> :callerId")
    Long findRoomReceiver(@Param("roomId") Long roomId, @Param("callerId") Long callerId);

    // 필요에 따라 다른 커스텀 쿼리 추가 가능
}
