package com.ajangajang.backend.sms.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class SmsCertificationDto {

    @NotBlank(message = "전화번호를 입력하세요.")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10~11자리의 숫자여야 합니다.")
    private String phone;

    private String certificationNumber;

}
