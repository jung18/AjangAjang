package com.ajangajang.backend.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserInfoDto {

    private Long id;
    private String nickname;
    private String profileImg;
    private Long mainAddressId;

    public UserInfoDto(Long id, String nickname, String profileImg) {
        this.id = id;
        this.nickname = nickname;
        this.profileImg = profileImg;
    }
}
