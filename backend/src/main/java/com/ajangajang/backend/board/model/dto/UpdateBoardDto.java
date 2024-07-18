package com.ajangajang.backend.board.model.dto;

import com.ajangajang.backend.board.model.entity.DeliveryType;
import com.ajangajang.backend.board.model.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Getter @Setter
@AllArgsConstructor
public class UpdateBoardDto {

    private String title;
    private Integer price;
    private String content;
    private DeliveryType deliveryType;
    private String tag;
    private Status status;

    private List<Long> deleteFileIds = new ArrayList<>();

}
