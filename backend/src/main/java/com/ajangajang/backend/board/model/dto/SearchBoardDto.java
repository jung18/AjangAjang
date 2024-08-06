package com.ajangajang.backend.board.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchBoardDto {
    private String title;
    private String category;
    private String addressCode;
    private int page;
    private int size;
}