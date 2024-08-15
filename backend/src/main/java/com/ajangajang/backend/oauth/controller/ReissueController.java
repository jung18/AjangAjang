package com.ajangajang.backend.oauth.controller;

import com.ajangajang.backend.oauth.jwt.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ReissueController {

    private final JwtUtil jwtUtil;

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        // request에서 Authorization-refresh 헤더를 찾음
        String refreshToken = request.getHeader("Authorization-refresh");

        // Authorization-refresh 헤더 검증
        if (refreshToken == null || !refreshToken.startsWith("Bearer/")) {
            log.info("token null");

            return new ResponseEntity<>("refresh token null", HttpStatus.UNAUTHORIZED);
        }

        // Bearer 부분 제거 후 순수 토큰만 획득
        String token = refreshToken.split("/")[1];

        // expired check
        try {
            jwtUtil.isExpired(token);
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>("refresh token expired", HttpStatus.UNAUTHORIZED);
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(token);

        if (!category.equals("refresh")) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.UNAUTHORIZED);
        }

        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        // 새로운 토큰 발급
        String newAccess = jwtUtil.createJwt("access", username, role, 24 * 60 * 60 * 1000L);

        // 토큰을 헤더에 담아서 응답
        response.setHeader("Authorization", "Bearer/" + newAccess);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
