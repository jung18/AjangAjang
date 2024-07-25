package com.ajangajang.backend.review.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class ReviewDto {

    private int score;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
