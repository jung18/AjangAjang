package com.ajangajang.backend.user.model.repository;

import com.ajangajang.backend.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByPhone(String phone);

    @Modifying
    @Query("UPDATE User u SET u.score = u.score + :score - 3 WHERE u.id = :userId")
    void changeUserScoreBySaveReview(Long userId, int score);

    @Modifying
    @Query("UPDATE User u SET u.score = u.score - :score + 3 WHERE u.id = :userId")
    void changeUserScoreByDeleteReview(Long userId, int score);

}
