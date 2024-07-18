package com.ajangajang.backend.oauth.config;

import com.ajangajang.backend.oauth.jwt.CustomSuccessHandler;
import com.ajangajang.backend.oauth.jwt.JwtFilter;
import com.ajangajang.backend.oauth.jwt.JwtUtil;
import com.ajangajang.backend.oauth.model.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        // CORS 설정
        httpSecurity
                .cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration configuration = new CorsConfiguration();

                        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
                        configuration.setAllowedMethods(Collections.singletonList("*"));
                        configuration.setAllowCredentials(true);
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        configuration.setMaxAge(3600L);

                        configuration.setExposedHeaders(Collections.singletonList("Set-Cookie"));
                        configuration.setExposedHeaders(Collections.singletonList("Authorization"));

                        return configuration;
                    }
                }));

        // csrf disable
        httpSecurity
                .csrf((auth) -> auth.disable());

        // form login disable
        httpSecurity
                .formLogin((auth) -> auth.disable());

        // http basic 인증 disable
        httpSecurity
                .httpBasic((auth) -> auth.disable());

        // JwtFilter 추가
        httpSecurity
                .addFilterAfter(new JwtFilter(jwtUtil), OAuth2LoginAuthenticationFilter.class);

        // oauth2
        httpSecurity
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customSuccessHandler));

        // 경로별 인가 작업
        httpSecurity
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/", "/test").permitAll()
                        .requestMatchers("/sign-up").hasRole("GUEST")
                        .anyRequest().hasRole("USER"));

        // 세션 stateless 설정
        httpSecurity
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return httpSecurity.build();
    }
}
