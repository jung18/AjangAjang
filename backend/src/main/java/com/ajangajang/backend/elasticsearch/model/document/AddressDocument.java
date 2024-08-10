package com.ajangajang.backend.elasticsearch.model.document;

import com.ajangajang.backend.api.kakaomap.model.entity.Regions;
import com.ajangajang.backend.board.model.entity.Board;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Builder
@Getter @Setter
@Document(indexName = "addresses")
public class AddressDocument {

    @Id
    private String addressCode;

    @Field(type = FieldType.Keyword)
    private List<String> closeCodes;

    @Field(type = FieldType.Keyword)
    private List<String> mediumCodes;

    @Field(type = FieldType.Keyword)
    private List<String> farCodes;

    public static AddressDocument from (Regions regions, List<String> closeCodes,
                                        List<String> mediumCodes, List<String> farCodes) {
        return AddressDocument.builder()
                .addressCode(regions.getAddressCode())
                .closeCodes(closeCodes)
                .mediumCodes(mediumCodes)
                .farCodes(farCodes)
                .build();
    }

}
