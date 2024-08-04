package com.ajangajang.backend.trade.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class SaveTradeResult {

    private Long tradeId;
    private List<RecommendDto> recommends = new ArrayList<>();

}
