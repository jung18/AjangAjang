package com.ajangajang.backend.board.model.repository;

import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.entity.BoardLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoardLikeRepository extends JpaRepository<BoardLike, Long> {

    boolean existsByBoardIdAndUserId(Long boardId, Long userId);

    BoardLike findByBoardIdAndUserId(Long boardId, Long userId);

    @Query("select b from Board b " +
            "join fetch b.likedUsers lu " +
            "join fetch lu.user u " +
            "where u.id = :userId order by b.updatedAt")
    List<Board> findMyLikes(Long userId);

}
