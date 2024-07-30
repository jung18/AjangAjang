package com.ajangajang.backend.oauth.controller;

import com.ajangajang.backend.oauth.jwt.JwtUtil;
import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.user.model.dto.UserInputDto;
import com.ajangajang.backend.user.model.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
    private final JwtUtil jwtUtil;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                    @RequestBody UserInputDto userInputDto,
                                    HttpServletRequest request, HttpServletResponse response) {

        // 유저 이름 가져오기
        String username = customOAuth2User.getUsername();

        // 유저 추가 정보 등록
        userService.signUp(username, userInputDto);

        // 새로운 access 토큰 발급
        String newAccess = jwtUtil.createJwt("access", username, "ROLE_USER", 10 * 60 * 1000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, "ROLE_USER", 24 * 60 * 60 * 1000L);

        // access 토큰 헤더에 담아서 응답
        response.setHeader("Authorization", "Bearer/" + newAccess);
        response.setHeader("Authorization-refresh", "Bearer/" + newRefresh);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
