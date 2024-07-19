package com.ajangajang.backend.board.model.dto;

import com.ajangajang.backend.board.model.entity.DeliveryType;
import com.ajangajang.backend.board.model.entity.Status;
import com.ajangajang.backend.user.model.dto.UserProfileDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class BoardListDto {

    private Long boardId;
    private UserProfileDto writer;
    private String title;
    private Integer price;
    private DeliveryType deliveryType;
    private String tag;
    private Status status;

}
