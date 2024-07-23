package com.ajangajang.backend.board.model.repository;

import com.ajangajang.backend.board.model.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("select b from Board b " +
            "join fetch b.writer " +
            "join fetch b.category " +
            "join fetch b.deliveryType order by b.updatedAt desc")
    List<Board> findAllWithWriter();

    @Query("select b from Board b " +
            "join fetch b.writer " +
            "join fetch b.category " +
            "join fetch b.deliveryType " +
            "where b.title like %:query% or b.content like %:query% " +
            "order by b.updatedAt desc")
    List<Board> findAllByQuery(@Param("query") String query);

    @Query("select b from Board b " +
            "join fetch b.writer " +
            "join fetch b.category c " +
            "join fetch b.deliveryType " +
            "where c.categoryName = :category " +
            "order by b.updatedAt desc")
    List<Board> findAllByTag(@Param("category") String category);

}
