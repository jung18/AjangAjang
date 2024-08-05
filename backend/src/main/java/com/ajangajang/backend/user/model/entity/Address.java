package com.ajangajang.backend.user.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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
