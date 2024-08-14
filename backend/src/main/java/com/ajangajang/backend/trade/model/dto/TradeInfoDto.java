package com.ajangajang.backend.trade.model.dto;

import com.ajangajang.backend.board.model.dto.BoardListDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class TradeInfoDto {

    private BoardListDto board;
    private Long tradeId;

}
