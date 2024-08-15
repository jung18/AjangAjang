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
            log.info("Refresh token is missing or invalid");
            return new ResponseEntity<>("Refresh token is missing or invalid", HttpStatus.UNAUTHORIZED);
        }

        // Bearer 부분 제거 후 순수 토큰만 획득
        String token = refreshToken.split("/")[1];

        // 토큰 유효성 검증
        try {
            if (!jwtUtil.validateToken(token)) {
                return new ResponseEntity<>("Invalid refresh token", HttpStatus.UNAUTHORIZED);
            }
        } catch (ExpiredJwtException e) {
            log.info("Refresh token expired");
            return new ResponseEntity<>("Refresh token expired", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            log.error("Error validating token", e);
            return new ResponseEntity<>("Error validating token", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // 토큰이 refresh인지 확인 (발급 시 페이로드에 명시)
        String category = jwtUtil.getCategory(token);
        if (!"refresh".equals(category)) {
            log.info("Invalid token category");
            return new ResponseEntity<>("Invalid refresh token", HttpStatus.UNAUTHORIZED);
        }

        // 토큰에서 사용자 정보 추출
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);

        // 새로운 액세스 토큰 발급
        String newAccess = jwtUtil.createJwt("access", username, role, 24 * 60 * 60 * 1000L);

        // 새로운 액세스 토큰을 헤더에 추가
        response.setHeader("Authorization", "Bearer/" + newAccess);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
