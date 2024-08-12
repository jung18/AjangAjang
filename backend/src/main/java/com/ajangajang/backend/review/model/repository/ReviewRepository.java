package com.ajangajang.backend.review.model.repository;

import com.ajangajang.backend.review.model.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r " +
            "JOIN FETCH r.trade t " +
            "JOIN FETCH t.seller s " +
            "WHERE s.id = :userId")
    List<Review> findMyReviews(Long userId);
}
