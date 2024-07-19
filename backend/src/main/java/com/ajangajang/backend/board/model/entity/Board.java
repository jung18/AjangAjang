package com.ajangajang.backend.board.model.entity;

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
    private String tag;

    @Enumerated(EnumType.STRING)
    private DeliveryType deliveryType;
    @Enumerated(EnumType.STRING)
    private Status status;

//    @ManyToOne
//    @JsonIgnore
//    @JoinColumn(name = "user_id")
//    private User writer;

    @OneToMany(mappedBy = "board", fetch = LAZY, cascade = REMOVE, orphanRemoval = true)
    private List<BoardMedia> mediaList = new ArrayList<>();

    public Board(String title, Integer price, String content, String tag, DeliveryType deliveryType, Status status) {
        this.title = title;
        this.price = price;
        this.content = content;
        this.tag = tag;
        this.status = status;
        this.deliveryType = deliveryType;
    }

    public void addMedia(BoardMedia media) {
        media.setBoard(this);
        this.mediaList.add(media);
    }
}
