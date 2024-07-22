package com.ajangajang.backend.exception;

import lombok.Getter;

@Getter
public class CustomGlobalException extends RuntimeException {

    CustomStatusCode customStatusCode;

    public CustomGlobalException(CustomStatusCode customStatusCode) {
        this.customStatusCode = customStatusCode;
    }
}
