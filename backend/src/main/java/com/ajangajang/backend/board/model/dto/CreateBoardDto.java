package com.ajangajang.backend.board.model.dto;

import com.ajangajang.backend.board.model.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter @Setter
@AllArgsConstructor
public class CreateBoardDto {

    private String title;
    private int price;
    private String content;
    private String category;
    private Status status;
    private Long addressId;

}
