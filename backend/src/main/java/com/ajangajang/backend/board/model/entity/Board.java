package com.ajangajang.backend.board.model.entity;

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

import static jakarta.persistence.CascadeType.*;
import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.*;


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

    @OneToOne
    @JoinColumn(name = "category_id")
    private Category category;
    @OneToOne
    @JoinColumn(name = "delivery_type_id")
    private DeliveryType deliveryType;
    // 유저 (작성자)
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User writer;

    @OneToMany(mappedBy = "board", fetch = LAZY, cascade = REMOVE, orphanRemoval = true)
    private List<BoardMedia> mediaList = new ArrayList<>();

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
}
