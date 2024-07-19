package com.ajangajang.backend.board.model.repository;

import com.ajangajang.backend.board.model.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("select b from Board b join fetch b.writer")
    List<Board> findAllWithWriter();

}
