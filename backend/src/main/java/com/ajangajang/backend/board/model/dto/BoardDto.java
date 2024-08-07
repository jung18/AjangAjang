package com.ajangajang.backend.board.model.dto;

import com.ajangajang.backend.board.model.entity.Status;
import com.ajangajang.backend.user.model.dto.UserProfileDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class BoardDto {

    private UserProfileDto writer;

    private String title;
    private int price;
    private String content;
    private String category;
    private Status status;
    private List<BoardMediaDto> mediaList = new ArrayList<>();
    private int likeCount;
    private int viewCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
