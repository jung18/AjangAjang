package com.ajangajang.backend.admin;

import com.ajangajang.backend.api.kakaomap.model.service.KakaoApiService;
import com.ajangajang.backend.api.kakaomap.model.service.RegionDataService;
import com.ajangajang.backend.api.kakaomap.model.service.TestDataService;
import com.ajangajang.backend.board.model.service.RecommendationDbSettingService;
import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController("/admin")
@RequiredArgsConstructor
public class DatabaseSettingController { // 초기 데이터 설정용

    private final RegionDataService regionDataService;
    private final KakaoApiService kakaoApiService;
    private final TestDataService testDataService;
    private final RecommendationDbSettingService recommendationDbSettingService;

    @GetMapping("/kakao/address") // csv에서 행정구역 정보 조회 -> 지역 테이블 만들기
    public ResponseEntity<?> getRegionData() {
        System.out.println("asdasdasdasdad");
        regionDataService.callApiByCSV();
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/kakao/nearby") // 인접지역 테이블 만들기
    public ResponseEntity<?> saveNearbyRegions() {
        regionDataService.saveNearbyRegions();
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/location/nearby") // 주소로 인접지역 조회하기
    public ResponseEntity<?> getNearbyRegions(@RequestParam String code,
                                            @RequestParam String type) {
        List<String> result = kakaoApiService.getNearbyAddressCodes(code, type);
        return ResponseEntity.ok(Map.of("data", result));
    }

    @GetMapping("/elastic/address")
    public ResponseEntity<?> saveElasticRegions() { // elasticsearch 지역 문서 만들기
        regionDataService.saveRegionsES();
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/board/test")
    public ResponseEntity<?> boardTestDataInit(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        testDataService.testDataInit(username);
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/recommendation/setting")
    public ResponseEntity<?> databaseSetting() {
        recommendationDbSettingService.databaseSetting();
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
