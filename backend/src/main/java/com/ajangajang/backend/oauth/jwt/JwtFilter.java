package com.ajangajang.backend.oauth.jwt;

import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.oauth.model.dto.UserDto;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
            // 헤더에서 토큰 추출
            String token = resolveToken(request);

            // 토큰 검증 및 SecurityContext 설정
            if (token != null && jwtUtil.validateToken(token)) {
                // 토큰에서 username과 role 획득
                String username = jwtUtil.getUsername(token);
                String role = jwtUtil.getRole(token);

                // userDTO를 생성하여 값 set
                UserDto userDTO = new UserDto();
                userDTO.setUsername(username);
                userDTO.setRole(role);

                // UserDetails에 회원 정보 객체 담기
                CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDTO);

                // 스프링 시큐리티 인증 토큰 생성
                Authentication authToken = new UsernamePasswordAuthenticationToken(
                        customOAuth2User, null, customOAuth2User.getAuthorities());

                // 세션에 사용자 등록
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        } catch (ExpiredJwtException e) {
            // 토큰 만료 예외 처리
            log.info("Expired JWT Token");
            handleException(response, "Expired JWT Token");
            return;
        } catch (JwtException e) {
            // JWT 관련 예외 처리
            log.info("Invalid JWT Token");
            handleException(response, "Invalid JWT Token");
            return;
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("Internal error during JWT processing", e);
            handleException(response, "Internal Server Error");
            return;
        }

        // 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer/")) {
            return bearerToken.split("/")[1];
        }
        return null;
    }

    private void handleException(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        PrintWriter writer = response.getWriter();
        writer.write("{\"error\": \"" + message + "\"}");
        writer.flush();
    }
}
