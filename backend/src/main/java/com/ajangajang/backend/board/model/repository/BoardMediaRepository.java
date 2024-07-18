package com.ajangajang.backend.board.model.repository;

import com.ajangajang.backend.board.model.entity.BoardMedia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardMediaRepository extends JpaRepository<BoardMedia, Long> {
}
