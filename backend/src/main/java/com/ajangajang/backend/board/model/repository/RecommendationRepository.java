package com.ajangajang.backend.board.model.repository;

import com.ajangajang.backend.board.model.entity.AgeGroup;
import com.ajangajang.backend.board.model.entity.Category;
import com.ajangajang.backend.board.model.entity.Gender;
import com.ajangajang.backend.board.model.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    @Modifying
    @Query("UPDATE Recommendation r SET r.viewCount = r.viewCount + 1 " +
            "WHERE r.ageGroup = :ageGroup AND r.gender = :gender AND r.category = :category")
    void increaseRecommendationViewCount(AgeGroup ageGroup, Gender gender, Category category);

    @Query("SELECT r.category FROM Recommendation r " +
            "WHERE r.ageGroup = :ageGroup AND r.gender = :gender " +
            "ORDER BY r.viewCount DESC LIMIT 1 ")
    Category findRecommendationCategory(AgeGroup ageGroup, Gender gender);
}
