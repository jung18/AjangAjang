package com.ajangajang.backend.board.model.dto;

import com.ajangajang.backend.board.model.entity.Board;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

@Getter
@Setter
public class SearchResultDto {
    private Page<BoardListDto> searchResult;
    private String originalTitle;
    private String suggestedTitle;
    private boolean changed;
}
