package com.ajangajang.backend.user.model.repository;

import com.ajangajang.backend.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
}
