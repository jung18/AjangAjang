package com.ajangajang.backend.api.kakaomap.model.entity;

import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;

public enum NearType {

    CLOSE,
    MEDIUM,
    FAR;

    public static NearType fromString(String nearType) {
        for (NearType type : NearType.values()) {
            if (type.name().equalsIgnoreCase(nearType)) {
                return type;
            }
        }
        throw new CustomGlobalException(CustomStatusCode.NEARTYPE_NOT_FOUND);
    }

}
