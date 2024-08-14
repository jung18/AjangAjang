package com.ajangajang.backend.chat.repository;

import com.ajangajang.backend.chat.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
