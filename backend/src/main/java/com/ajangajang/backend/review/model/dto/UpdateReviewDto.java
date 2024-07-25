package com.ajangajang.backend.review.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class UpdateReviewDto {

    private int score;
    private String content;

}
