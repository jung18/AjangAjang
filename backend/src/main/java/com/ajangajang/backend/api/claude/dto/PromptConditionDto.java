package com.ajangajang.backend.api.claude.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PromptConditionDto {

    private String item;
    private int price;
    private String usagePeriod;
    private String itemCondition;
    private String tone;
    private String age;
    private String gender;

}
