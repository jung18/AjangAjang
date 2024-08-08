package com.ajangajang.backend.user.model.entity;

import com.ajangajang.backend.api.kakaomap.model.entity.NearType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Address {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String sido; // 시/도

    private String sigg; // 시/군/구

    private String emd; // 읍/면/동

    private String fullAddress; // 전체 주소

    private double longitude; // 경도

    private double latitude; // 위도

    private String addressCode; // 법정코드

    @Enumerated(EnumType.STRING)
    private NearType nearType = NearType.MEDIUM; // 해당 주소기준 조회 범위, 기본값 10km

    public Address(String sido, String sigg, String emd, String fullAddress, double longitude, double latitude, String addressCode) {
        this.sido = sido;
        this.sigg = sigg;
        this.emd = emd;
        this.fullAddress = fullAddress;
        this.longitude = longitude;
        this.latitude = latitude;
        this.addressCode = addressCode;
    }
}
