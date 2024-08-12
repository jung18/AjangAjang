package com.ajangajang.backend.user.model.entity;

import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.entity.BoardLike;
import com.ajangajang.backend.chat.entity.ChatMessage;
import com.ajangajang.backend.chat.entity.UserRoom;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.CascadeType.REMOVE;
import static jakarta.persistence.FetchType.LAZY;

@Entity
@Getter @Setter
@EntityListeners(UserEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username; // 식별 아이디

    private String name;

    private String role;

    private String nickname;

    private String phone;

    private String profileImg;

    private Long mainChildId;

    private int score;

    @OneToMany(mappedBy = "writer", cascade = REMOVE, orphanRemoval = true)
    private List<Board> myBoards = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<BoardLike> myLikes = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = REMOVE, orphanRemoval = true)
    private List<Child> children = new ArrayList<>();

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "main_address_id")
    private Address mainAddress;

    @OneToMany(mappedBy = "user", cascade = REMOVE, orphanRemoval = true)
    private List<ChatMessage> chatMessages = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = REMOVE, orphanRemoval = true)
    private List<UserRoom> userRooms = new ArrayList<>();

    public void addMyBoard(Board board) {
        board.setWriter(this);
        this.myBoards.add(board);
    }

    public void addMyLike(BoardLike like) {
        like.setUser(this);
        this.myLikes.add(like);
    }

}
