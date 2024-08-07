package com.ajangajang.backend.user.model.repository;

import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.user.model.entity.Kid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface KidRepository extends JpaRepository<Kid, Long> {
}
