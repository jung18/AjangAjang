package com.ajangajang.backend.api.claude.model.service;

import com.ajangajang.backend.api.claude.dto.PromptConditionDto;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClaudeApi {

    @Value("${claude.api.key}")
    private String apiKey;

    @Value("${claude.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public String callClaudeApi(String tone, PromptConditionDto condition) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");  // API 버전 헤더 추가

        Map<String, Object> body = new HashMap<>();
        body.put("model", "claude-3-sonnet-20240229");
        body.put("max_tokens", 1000);
        body.put("messages", Collections.singletonList(
                Map.of("role", "user", "content", getPromptInput(tone, condition))
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                JSONObject jsonObject = new JSONObject(response.getBody());
                JSONArray contentArray = jsonObject.getJSONArray("content");
                JSONObject contentObject = contentArray.getJSONObject(0);
                return contentObject.getString("text");
            } else {
                throw new CustomGlobalException(CustomStatusCode.API_CALL_FAILED);
            }

        } catch (Exception e) {
            log.info("{}", e.getMessage());
            throw new CustomGlobalException(CustomStatusCode.API_CALL_FAILED);
        }
    }

    private static String getPromptInput(String tone, PromptConditionDto condition) {

        return "당신은 중고 육아용품을 판매하려는 사람입니다. 아래의 키워드들을 포함하고, " +
                "물건 정보에 모델명이나 네고 가능같은 과한 부가정보 붙이지 않고, " + tone + "으로, " +
                "판매글을 작성해주세요.\n" +
                "판매하려는 물건: " + condition.getItem() + "\n" +
                "판매가격: " + condition.getPrice() + "\n" +
                "사용기간: " + condition.getUsagePeriod() + "\n" +
                "물건의상태: " + condition.getItemCondition();
    }
}
