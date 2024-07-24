package com.ajangajang.backend.user.model.entity;

import com.ajangajang.backend.board.model.entity.Board;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.CascadeType.REMOVE;
import static jakarta.persistence.FetchType.LAZY;

@Entity
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username; // 식별 아이디

    @OneToMany(mappedBy = "writer", fetch = LAZY, cascade = REMOVE, orphanRemoval = true)
    private List<Board> myBoards = new ArrayList<>();

    private String name;
    private String role;

    private String nickname;
    private String phone;

    private String profileImg;
}
