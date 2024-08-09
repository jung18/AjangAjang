package com.ajangajang.backend.board.model.dto;

import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.user.model.dto.AddressDto;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@Setter
public class SearchResultDto {
    private Page<BoardListDto> searchResult;
    private List<AddressDto> addressList;
    private String originalTitle;
    private String suggestedTitle;
    private boolean changed;
}
