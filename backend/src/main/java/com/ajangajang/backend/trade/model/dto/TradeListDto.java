package com.ajangajang.backend.trade.model.dto;

import com.ajangajang.backend.board.model.dto.BoardListDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TradeListDto {

    private List<BoardListDto> buyingTrades;
    private List<BoardListDto> sellingTrades;

}
