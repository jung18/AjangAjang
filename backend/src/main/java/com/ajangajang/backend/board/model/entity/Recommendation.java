package com.ajangajang.backend.board.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AgeGroup ageGroup;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private Category category;

    private int viewCount;

    public Recommendation(AgeGroup ageGroup, Gender gender, Category category) {
        this.ageGroup = ageGroup;
        this.gender = gender;
        this.category = category;
        this.viewCount = 0;
    }

}
