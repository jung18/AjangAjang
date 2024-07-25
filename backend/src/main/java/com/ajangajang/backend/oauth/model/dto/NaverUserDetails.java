package com.ajangajang.backend.oauth.model.dto;

import java.util.Map;

public class NaverUserDetails implements OAuth2UserDetails {

    private final Map<String, Object> attribute;

    public NaverUserDetails(Map<String, Object> attribute) {
        this.attribute = (Map<String, Object>) attribute.get("response");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getProviderId() {
        return attribute.get("id").toString();
    }

    @Override
    public String getName() {
        return attribute.get("name").toString();
    }
}
