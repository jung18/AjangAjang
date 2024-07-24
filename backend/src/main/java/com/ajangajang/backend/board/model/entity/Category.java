package com.ajangajang.backend.board.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Category {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String categoryName;

    public Category(String categoryName) {
        this.categoryName = categoryName;
    }
}
