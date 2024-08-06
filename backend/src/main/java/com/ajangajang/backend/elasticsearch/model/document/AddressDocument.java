package com.ajangajang.backend.elasticsearch.model.document;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import java.util.List;

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

}
