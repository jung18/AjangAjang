package com.ajangajang.backend.review.model.entity;

import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.user.model.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Review {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private int score;
    private String content;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User writer;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "board_id")
    private Board board;

    public Review(int score, String content) {
        this.score = score;
        this.content = content;
    }
}
