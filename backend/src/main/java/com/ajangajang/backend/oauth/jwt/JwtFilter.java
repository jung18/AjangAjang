package com.ajangajang.backend.oauth.jwt;

import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.oauth.model.dto.UserDto;
import io.jsonwebtoken.ExpiredJwtException;
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

        // request에서 Authorization 헤더를 찾음
        String accessToken = request.getHeader("Authorization");

        // Authorization 헤더 검증
        if (accessToken == null || !accessToken.startsWith("Bearer/")) {
            log.info("token null");
            filterChain.doFilter(request, response);

            return; // 조건이 해당되면 메소드 종료 (필수)
        }

        // Bearer 부분 제거 후 순수 토큰만 획득
        String token = accessToken.split("/")[1];

        // 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try {
            jwtUtil.isExpired(token);
        } catch (ExpiredJwtException e) {
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 토큰이 access인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(token);
        if (!category.equals("access")) {

            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
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
