package com.ajangajang.backend.user.model.repository;

import com.ajangajang.backend.user.model.entity.Child;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChildRepository extends JpaRepository<Child, Long> {
}
