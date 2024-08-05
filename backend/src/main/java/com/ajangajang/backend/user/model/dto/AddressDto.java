package com.ajangajang.backend.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class AddressDto {

    private Long addressId;
    private String sido; // 시/도
    private String sigg; // 시/군/구
    private String emd; // 읍/면/동
    private String fullAddress; // 나머지 상세주소

    public AddressDto(String sido, String sigg, String emd, String fullAddress) {
        this.sido = sido;
        this.sigg = sigg;
        this.emd = emd;
        this.fullAddress = fullAddress;
    }
}
