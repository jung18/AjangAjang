package com.ajangajang.backend.oauth.model.dto;

import lombok.AllArgsConstructor;

import java.util.Map;

@AllArgsConstructor
public class KakaoResponse implements OAuth2Response {

    private final Map<String, Object> attribute;

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getProviderId() {
        return attribute.get("id").toString();
    }

    @Override
    public String getName() {
        return (String) ((Map) attribute.get("properties")).get("nickname");
    }
}
