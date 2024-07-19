package com.ajangajang.backend.board.model.dto;

import com.ajangajang.backend.board.model.entity.MediaType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@AllArgsConstructor
public class BoardMediaDto {

    private Long mediaId;
    private MediaType mediaType;
    private String mediaUrl;
    private LocalDateTime createdAt;

}
