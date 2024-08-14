package com.ajangajang.backend.user.model.service;

import org.springframework.stereotype.Service;

@Service
public class LevelService {

    public String getLevel(int score) {
        if (score > 92) {
            return "숲";
        } else if (score > 80) {
            return "나무";
        } else if (score > 68) {
            return "열매";
        } else if (score > 56) {
            return "가지";
        } else if (score > 44) {
            return "잎새";
        } else if (score > 32) {
            return "새싹";
        } else if (score > 20) {
            return "씨앗";
        } else if (score > 8) {
            return "사기꾼";
        } else {
            return "범죄자";
        }
    }

}
