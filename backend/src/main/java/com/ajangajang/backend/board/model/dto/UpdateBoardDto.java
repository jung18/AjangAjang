package com.ajangajang.backend.board.model.dto;

import com.ajangajang.backend.board.model.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBoardDto {

    private String title;
    private int price;
    private String content;
    private String category;
    private Status status;
    private Long addressId;

    private List<Long> deleteFileIds = new ArrayList<>();

    public UpdateBoardDto(String title, int price, String content, String category, Status status) {
        this.title = title;
        this.price = price;
        this.content = content;
        this.category = category;
        this.status = status;
    }
}
