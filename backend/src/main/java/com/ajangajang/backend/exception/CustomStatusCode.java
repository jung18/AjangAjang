package com.ajangajang.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomStatusCode {

    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 게시판"),
    MEDIA_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 미디어"),
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 카테고리"),
    DELIVERY_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 거래방식"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 유저"),

    EMPTY_UPDATE_DATA(HttpStatus.BAD_REQUEST, "업데이트할 데이터 없음"),
    FILE_UPLOAD_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드 실패"),
    UNSUPPORTED_FILE_FORMAT(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "지원하지 않는 파일 형식");

    private final HttpStatus statusCode;
    private final String message;

}
