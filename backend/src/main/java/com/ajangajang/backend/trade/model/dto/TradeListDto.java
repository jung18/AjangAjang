package com.ajangajang.backend.trade.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TradeListDto {

    private List<TradeDto> buyingTrades;
    private List<TradeDto> sellingTrades;

}
