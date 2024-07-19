package com.ajangajang.backend.board.model.dto;

import com.ajangajang.backend.board.model.entity.DeliveryType;
import com.ajangajang.backend.board.model.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter @Setter
@AllArgsConstructor
public class CreateBoardDto {

//    private Long writerId;
    private String title;
    private Integer price;
    private String content;
    private DeliveryType deliveryType;
    private String tag;
    private Status status;

}
