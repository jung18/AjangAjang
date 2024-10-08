package com.ajangajang.backend.board.model.dto;

import com.ajangajang.backend.api.kakaomap.model.entity.NearType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchBoardDto {
    private String title;
    private String category;
    private int page;
    private int size;
    private boolean retry;
}