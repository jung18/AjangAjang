package com.ajangajang.backend.user.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

@Getter
@Setter
public class SignUpDto {

    @Size(max = 20)
    private String nickname;

    @Size(min = 10, max = 11)
    private String phone;

    @Max(20)
    private int kidAge;

    @Range(min = 1, max = 2)
    private int kidGender;
}
