package com.ajangajang.backend.review.model.repository;

import com.ajangajang.backend.review.model.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
