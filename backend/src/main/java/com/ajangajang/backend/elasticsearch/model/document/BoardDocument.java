package com.ajangajang.backend.elasticsearch.model.document;

import com.ajangajang.backend.board.model.entity.Board;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

import java.time.LocalDateTime;

@Document(indexName = "boards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setting(settingPath = "static/elastic-setting.json")
public class BoardDocument {

    @Id
    private Long boardId;

    @Field(type = FieldType.Text, analyzer = "nori_analyzer")
    private String title;

    @Field(type = FieldType.Keyword)
    private String category;

    @Field(type = FieldType.Keyword)
    private String addressCode;

    @Field(type = FieldType.Keyword)
    private String status;

    public static BoardDocument from (Board board) {
        return BoardDocument.builder()
                .boardId(board.getId())
                .title(board.getTitle())
                .category(board.getCategory().getCategoryName())
                .addressCode(board.getAddress().getAddressCode())
                .status(board.getStatus().toString())
                .build();
    }
}
