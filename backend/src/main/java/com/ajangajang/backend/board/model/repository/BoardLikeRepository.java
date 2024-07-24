package com.ajangajang.backend.board.model.repository;

import com.ajangajang.backend.board.model.entity.BoardLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardLikeRepository extends JpaRepository<BoardLike, Long> {

    int countLikesByBoardId(Long boardId);

    boolean existsByBoardIdAndUserName(Long boardId, String userName);

    BoardLike findByBoardIdAndUserName(Long boardId, String userName);

}
