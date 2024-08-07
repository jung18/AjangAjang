package com.ajangajang.backend.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChildListDto {

    private Long id;
    private String name;
    private LocalDate birthDate;
    private String gender;

}
