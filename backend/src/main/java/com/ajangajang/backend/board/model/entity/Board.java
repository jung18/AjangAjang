package com.ajangajang.backend.board.model.entity;

import com.ajangajang.backend.trade.model.entity.Trade;
import com.ajangajang.backend.user.model.entity.Address;
import com.ajangajang.backend.user.model.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.CascadeType.REMOVE;
import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;


@Entity
@Getter
@Setter
@NoArgsConstructor
public class Board {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String title;

    private int price;

    @Column(columnDefinition = "longtext")
    private String content;

    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private Status status;

    private int viewCount;

    @Enumerated(EnumType.STRING)
    private Category category;

    // 유저 (작성자)
    @ManyToOne(fetch = LAZY)
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User writer;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToOne(fetch = LAZY, mappedBy = "item")
    private Trade trade;

    @OneToMany(mappedBy = "board", cascade = REMOVE, orphanRemoval = true)
    private List<BoardMedia> mediaList = new ArrayList<>();

    @OneToMany(mappedBy = "board")
    private List<BoardLike> likedUsers = new ArrayList<>();

    public Board(String title, int price, String content, Status status, Category category) {
        this.title = title;
        this.price = price;
        this.content = content;
        this.status = status;
        this.category = category;
    }

    public void addMedia(BoardMedia media) {
        media.setBoard(this);
        this.mediaList.add(media);
    }

    public void addLikedUser(BoardLike like) {
        like.setBoard(this);
        this.likedUsers.add(like);
    }

}
