package com.ajangajang.backend.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class UserProfileDto {

    private Long userId;
    private String nickname;
    private String profileImage;
    private String level;

}
