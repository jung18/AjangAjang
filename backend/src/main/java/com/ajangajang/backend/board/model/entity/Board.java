package com.ajangajang.backend.board.model.entity;

import com.ajangajang.backend.api.kakaomap.model.entity.Regions;
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
@Getter @Setter
@NoArgsConstructor
public class Board {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String title;
    private Integer price;
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

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    @ManyToOne
    @JoinColumn(name = "delivery_type_id")
    private DeliveryType deliveryType;
    // 유저 (작성자)
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User writer;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @OneToMany(mappedBy = "board", fetch = LAZY, cascade = REMOVE, orphanRemoval = true)
    private List<BoardMedia> mediaList = new ArrayList<>();

    @OneToMany(mappedBy = "board", fetch = LAZY)
    private List<BoardLike> likedUsers = new ArrayList<>();

    public Board(String title, Integer price, String content, Status status) {
        this.title = title;
        this.price = price;
        this.content = content;
        this.status = status;
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
