package com.ajangajang.backend.oauth.jwt;

import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        // OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String access = jwtUtil.createJwt("access", username, role, 10 * 60 * 1000L);
        String refresh = jwtUtil.createJwt("refresh", username, role, 24 * 60 * 60 * 1000L);
        response.addCookie(createCookie("Authorization", "Bearer/" + access));
        response.addCookie(createCookie("Authorization-refresh", "Bearer/" + refresh));

        log.info(customUserDetails.getRole());

        // User의 Role이 GUEST일 경우 처음 요청한 회원이므로 회원가입 페이지로 리다이렉트
        if (customUserDetails.getRole().equals("ROLE_GUEST")) {
            response.sendRedirect("http://localhost:3000/sign-up");
        } else if (customUserDetails.getRole().equals("ROLE_USER")) {
            response.sendRedirect("http://localhost:3000/");
        } else {
            response.sendRedirect("http://localhost:3000/");
        }
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        cookie.setPath("/");
//        cookie.setHttpOnly(true);
//        cookie.setSecure(true);

        return cookie;
    }
}
