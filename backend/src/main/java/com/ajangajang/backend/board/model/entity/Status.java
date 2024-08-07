package com.ajangajang.backend.board.model.entity;

import com.ajangajang.backend.api.kakaomap.model.entity.NearType;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;

public enum Status {

    FOR_SALE,
    SOLD_OUT,
    RESERVED;

    public static Status fromString(String status) {
        for (Status val : Status.values()) {
            if (val.name().equalsIgnoreCase(status)) {
                return val;
            }
        }
        throw new CustomGlobalException(CustomStatusCode.STATUS_NOT_FOUND);
    }

}
