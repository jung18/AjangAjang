package com.ajangajang.backend.board.model.repository;

import com.ajangajang.backend.board.model.entity.DeliveryType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryTypeRepository extends JpaRepository<DeliveryType, Long> {
}
