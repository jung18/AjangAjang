package com.ajangajang.backend.oauth.model.service;

import com.ajangajang.backend.oauth.model.dto.*;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info(oAuth2User.toString());
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2UserDetails oAuth2UserDetails = null;
        if (registrationId.equals("naver")) {
            oAuth2UserDetails = new NaverUserDetails(oAuth2User.getAttributes());
        }
        else if (registrationId.equals("google")) {
            oAuth2UserDetails = new GoogleUserDetails(oAuth2User.getAttributes());
        }
        else if (registrationId.equals("kakao")) {
            oAuth2UserDetails = new KakaoUserDetails(oAuth2User.getAttributes());
        }
        else {
            return null;
        }

        // 리소스 서버에서 발급 받은 정보로 사용자를 특정할 아이디값을 만듬
        String username = oAuth2UserDetails.getProvider() + " " + oAuth2UserDetails.getProviderId();

        User existData = userRepository.findByUsername(username).orElse(null);

        if (existData == null) {
            User user = new User();
            user.setUsername(username);
            user.setName(oAuth2UserDetails.getName());
            user.setRole("ROLE_GUEST");

            userRepository.save(user);

            UserDto userDto = new UserDto();
            userDto.setUsername(username);
            userDto.setName(oAuth2UserDetails.getName());
            userDto.setRole("ROLE_GUEST");

            return new CustomOAuth2User(userDto);
        } else {
            existData.setName(oAuth2UserDetails.getName());

            userRepository.save(existData);

            UserDto userDto = new UserDto();
            userDto.setUsername(existData.getUsername());
            userDto.setName(existData.getName());
            userDto.setRole(existData.getRole());

            return new CustomOAuth2User(userDto);
        }
    }
}
