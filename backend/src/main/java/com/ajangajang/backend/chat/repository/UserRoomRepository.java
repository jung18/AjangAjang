package com.ajangajang.backend.chat.repository;

import com.ajangajang.backend.chat.entity.UserRoom;
import com.ajangajang.backend.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRoomRepository extends JpaRepository<UserRoom, Long> {
    List<UserRoom> findByUser(User user);
}
