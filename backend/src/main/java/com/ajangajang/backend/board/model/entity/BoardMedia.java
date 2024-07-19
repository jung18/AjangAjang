package com.ajangajang.backend.board.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@NoArgsConstructor
public class BoardMedia {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "board_id")
    private Board board;

    @Enumerated(EnumType.STRING)
    private MediaType mediaType;

    private String mediaUrl;
    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    public BoardMedia(MediaType mediaType, String mediaUrl) {
        this.mediaType = mediaType;
        this.mediaUrl = mediaUrl;
    }
}
