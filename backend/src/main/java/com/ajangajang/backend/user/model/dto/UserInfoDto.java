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
    private int level;

    public UserInfoDto(Long id, String nickname, String profileImg, int level) {
        this.id = id;
        this.nickname = nickname;
        this.profileImg = profileImg;
        this.level = level;
    }
}
