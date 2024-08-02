package com.ajangajang.backend.api.kakaomap.controller;

import com.ajangajang.backend.api.kakaomap.model.entity.Regions;
import com.ajangajang.backend.api.kakaomap.model.service.KakaoMapApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class KakaoMapApiController {

    private final KakaoMapApiService kakaoMapApiService;

    @GetMapping("/api/kakao/address") // 행정구역 정보 조회
    public ResponseEntity<?> getAddressData() {
        kakaoMapApiService.callApiByCSV();
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/api/kakao/nearby") // 인접지역 테이블 만들기
    public ResponseEntity<?> saveNearbyAddresses() {
        kakaoMapApiService.saveNearbyAddresses();
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/api/location/nearby") // 주소로 인접지역 조회하기
    public ResponseEntity<?> getNearbyAddresses(@RequestParam String code,
                                            @RequestParam String type) {
        List<Regions> result = kakaoMapApiService.getNearbyAddresses(code, type);
        return ResponseEntity.ok(Map.of("data", result));
    }

}
