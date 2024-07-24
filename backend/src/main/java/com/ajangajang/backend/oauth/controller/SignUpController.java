package com.ajangajang.backend.oauth.controller;

import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.user.model.dto.UserInputDto;
import com.ajangajang.backend.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class SignUpController {

    private final UserService userService;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                    @RequestBody UserInputDto userInputDto) {

        // 유저 이름 가져오기
        String username = customOAuth2User.getUsername();
        userService.signUp(username, userInputDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
