package com.ajangajang.backend.trade.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class TradeDto {

    private Long tradeId;
    private Long buyerId;
    private Long sellerId;
    private Long itemId; // 판매글
    private String boardTitle; // 판매글 제목
    private LocalDateTime tradeDate;

}
