package com.ajangajang.backend.board.model.repository;

import com.ajangajang.backend.board.model.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("select b from Board b " +
            "join fetch b.writer " +
            "join fetch b.category " +
            "join fetch b.address a " +
            "where a.addressCode in :codes order by b.updatedAt desc")
    List<Board> findAllInRange(List<String> codes);

    @Query("select b from Board b join fetch b.writer w " +
            "where w.id = :userId order by b.updatedAt desc")
    List<Board> findAllByUserId(Long userId);

    @Query("select b from Board b join fetch b.writer w " +
            "where b.id in :ids order by b.updatedAt desc")
    List<Board> findByIdIn(List<Long> ids);

    @Modifying
    @Query("UPDATE Board b SET b.viewCount = b.viewCount + 1 WHERE b.id = :boardId")
    void increaseViewCount(Long boardId);
}
