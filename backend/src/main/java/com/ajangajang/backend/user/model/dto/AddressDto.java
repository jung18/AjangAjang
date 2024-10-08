package com.ajangajang.backend.user.model.dto;

import com.ajangajang.backend.api.kakaomap.model.entity.NearType;
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
    private NearType nearType; // 조회 범위
    private boolean isRep; // 대표주소인지 확인

    public AddressDto(Long addressId, String sido, String sigg, String emd, String fullAddress, NearType nearType) {
        this.addressId = addressId;
        this.sido = sido;
        this.sigg = sigg;
        this.emd = emd;
        this.fullAddress = fullAddress;
        this.nearType = nearType;
    }

}
