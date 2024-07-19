package com.ajangajang.backend.board.model.repository;

import com.ajangajang.backend.board.model.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
}
