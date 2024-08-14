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
    private String mainAddressName;
    private double longitude;
    private double latitude;
    private String level;
    private int score;

}
