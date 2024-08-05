package com.ajangajang.backend.sms.controller;

import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.sms.model.dto.SmsCertificationDto;
import com.ajangajang.backend.sms.model.service.SmsCertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/sms")
@RequiredArgsConstructor
@Slf4j
public class SmsCertificationController {

    private final SmsCertificationService smsCertificationService;

    @PostMapping("/send")
    public ResponseEntity<?> sendSms(@Valid @RequestBody SmsCertificationDto smsCertificationDto,
                                     BindingResult result) throws Exception {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        try {
            smsCertificationService.sendSms(smsCertificationDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<Void> SmsVerification(@RequestBody SmsCertificationDto smsCertificationDto) throws Exception{
        try {
            smsCertificationService.verifySms(smsCertificationDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (CustomGlobalException e) {
            throw e;
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
