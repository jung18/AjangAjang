package com.ajangajang.backend.openvidu.controller;

import io.openvidu.java.client.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/openvidu")
public class OpenViduController {

    @Autowired
    private OpenVidu openVidu;

    // 세션 생성
    @PostMapping("/sessions")
    public ResponseEntity<String> createSession() {
        try {
            Session session = openVidu.createSession();
            return ResponseEntity.ok(session.getSessionId());
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return ResponseEntity.status(500).body("Failed to create session: " + e.getMessage());
        }
    }

    // 토큰 발급
    @PostMapping("/tokens")
    public ResponseEntity<String> createToken(@RequestBody String sessionId) {
        try {
            Session session = openVidu.getActiveSessions().stream()
                    .filter(s -> s.getSessionId().equals(sessionId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Session not found"));
            return ResponseEntity.ok(session.generateToken(new TokenOptions.Builder().build()));
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return ResponseEntity.status(500).body("Failed to create token: " + e.getMessage());
        }
    }

    // 세션 및 토큰 발급을 한 번에 처리하는 엔드포인트
    @PostMapping("/join")
    public ResponseEntity<Map<String, String>> joinSession() {
        Map<String, String> response = new HashMap<>();
        try {
            // 세션 생성
            Session session = openVidu.createSession();
            String sessionId = session.getSessionId();

            // 토큰 발급
            String token = session.generateToken(new TokenOptions.Builder().build());

            // 응답에 sessionId와 token 추가
            response.put("sessionId", sessionId);
            response.put("token", token);

            return ResponseEntity.ok(response);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
