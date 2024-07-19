package com.ajangajang.backend.oauth.jwt;

import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.oauth.model.dto.UserDto;
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

@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // request에서 Authorization 헤더를 찾음
        String authorization = request.getHeader("Authorization");

        // Authorization 헤더 검증
        if (authorization == null || !authorization.startsWith("Bearer/")) {
            log.info("token null");
            filterChain.doFilter(request, response);

            // 조건이 해당되면 메소드 종료 (필수)
            return;
        }

        // Bearer 부분 제거 후 순수 토큰만 획득
        String token = authorization.split("/")[1];

        // 토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {
            log.info("token expired");
            filterChain.doFilter(request, response);

            // 조건이 해당되면 메소드 종료 (필수)
            return;
        }

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
        Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null, customOAuth2User.getAuthorities());

        // 세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
