package com.ajangajang.backend.board.model.dto;

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
    private int price;
    private String deliveryType;
    private String category;
    private Status status;
    private int likeCount;

    public BoardListDto(Long boardId, String title, int price, String deliveryType, String category, Status status, int likeCount) {
        this.boardId = boardId;
        this.title = title;
        this.price = price;
        this.deliveryType = deliveryType;
        this.category = category;
        this.status = status;
        this.likeCount = likeCount;
    }
}
