package com.ajangajang.backend.review.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class CreateReviewDto {

    private Long boardId;
    private int score;
    private String content;

}
