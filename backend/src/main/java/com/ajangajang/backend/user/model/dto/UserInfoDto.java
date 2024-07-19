package com.ajangajang.backend.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserInfoDto {

    private String name;
    private String email;
    private String nickname;
    private String phone;
    private int kidAge;
    private int kidGender;
    private String profileImg;

}
