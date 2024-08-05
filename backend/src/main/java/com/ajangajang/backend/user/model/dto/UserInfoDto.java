package com.ajangajang.backend.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserInfoDto {

    private String nickname;
    private String profileImg;
    private Long mainAddressId;

    public UserInfoDto(String nickname, String profileImg) {
        this.nickname = nickname;
        this.profileImg = profileImg;
    }
}
