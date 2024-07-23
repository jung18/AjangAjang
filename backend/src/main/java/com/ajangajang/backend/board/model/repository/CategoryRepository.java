package com.ajangajang.backend.board.model.repository;

import com.ajangajang.backend.board.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
