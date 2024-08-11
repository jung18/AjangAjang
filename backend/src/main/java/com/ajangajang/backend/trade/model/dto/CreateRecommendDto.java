package com.ajangajang.backend.trade.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class CreateRecommendDto {

    private Long buyerId;
    private RecommendType recommendType; // 추천받을 위치 기준
    private double longitude; // 판매글 경도
    private double latitude; // 판매글 위도

}
