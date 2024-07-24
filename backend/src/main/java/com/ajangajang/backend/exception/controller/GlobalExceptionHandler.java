package com.ajangajang.backend.exception.controller;

import com.ajangajang.backend.exception.CustomGlobalException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomGlobalException.class)
    public ResponseEntity<?> handleCustomGlobalException(CustomGlobalException e) {
        HttpStatus statusCode = e.getCustomStatusCode().getStatusCode();
        String message = e.getCustomStatusCode().getMessage();
        log.info("[handleCustomGlobalException] = {}", message);
        return new ResponseEntity<>(Map.of("message", message), statusCode);
    }

}
