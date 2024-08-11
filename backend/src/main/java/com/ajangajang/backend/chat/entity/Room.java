package com.ajangajang.backend.chat.entity;

import com.ajangajang.backend.board.model.entity.Board;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String lastMessage;

    private LocalDateTime lastMessageTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board; // 추가된 부분

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserRoom> userRooms = new ArrayList<>();

    public void addUserRoom(UserRoom userRoom) {
        userRoom.setRoom(this);
        this.userRooms.add(userRoom);
    }
}
