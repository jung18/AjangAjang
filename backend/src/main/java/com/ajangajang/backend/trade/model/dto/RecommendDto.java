package com.ajangajang.backend.trade.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class RecommendDto {

    private String fullAddress;
    private String placeName;
    private double longitude; // x
    private double latitude; // y

}
