package com.ajangajang.backend.board.controller;

import com.ajangajang.backend.board.model.service.RecommendationDbSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/recommendation")
@RequiredArgsConstructor
public class RecommendationDbSettingController {

    private final RecommendationDbSettingService recommendationDbSettingService;

    @GetMapping("/setting")
    public ResponseEntity<?> databaseSetting() {
        recommendationDbSettingService.databaseSetting();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
