package com.ajangajang.backend.oauth.model.dto;

public interface OAuth2UserDetails {

    //제공자 (Ex. naver, google, ...)
    String getProvider();

    //제공자에서 발급해주는 아이디 (번호)
    String getProviderId();

    //사용자 실명 설정한 이름)
    String getName();
}
