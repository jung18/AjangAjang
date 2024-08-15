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

    public Map<String, String> callClaudeApi(PromptConditionDto condition) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");  // API 버전 헤더 추가

        Map<String, Object> body = new HashMap<>();
        body.put("model", "claude-3-sonnet-20240229");
        body.put("max_tokens", 1000);
        body.put("messages", Collections.singletonList(
                Map.of("role", "user", "content", getPromptInput(condition))
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
                String text = contentObject.getString("text");

                String[] lines = text.split("\\n\\n", 2); // 빈 줄을 기준으로 분리
                String title = lines[0];
                String content = lines.length > 1 ? lines[1] : "";
                return Map.of("title", title, "content", content);
            } else {
                throw new CustomGlobalException(CustomStatusCode.API_CALL_FAILED);
            }

        } catch (Exception e) {
            log.info("{}", e.getMessage());
            throw new CustomGlobalException(CustomStatusCode.API_CALL_FAILED);
        }
    }

    private static String getPromptInput(PromptConditionDto condition) {

        return "다음 조건에 맞춰 중고 육아용품 판매 게시글을 작성해 주세요:\n" +
                "\n" +
                "1. 작성자 역할: " + condition.getAge() + "개월 " + condition.getGender() + "자 아기의 부모\n" +
                "\n" +
                "2. 대상 독자: 육아용품을 찾는 예비 부모 또는 영유아 부모\n" +
                "\n" +
                "3. 제품명: " + condition.getItem() + "\n" +
                "\n" +
                "4. 가격: " + condition.getPrice() + "원\n" +
                "\n" +
                "5. 사용 기간: " + condition.getUsagePeriod() + "\n" +
                "\n" +
                "6. 제품 상태: " + condition.getItemCondition() + "\n" +
                "\n" +
                "7. 글 구조:\n" +
                "   - 제목\n" +
                "   - 제품 소개 (1문단, 공백포함 120자)\n" +
                "   - 판매 가격\n" +
                "   - 사용 기간\n" +
                "   - 제품 상태 설명 (1문단, 공백포함 100자)\n" +
                "\n" +
                "8. 톤과 스타일: \n" +
                "   - " + condition.getTone() + " 톤\n" +
                "\n" +
                "9. 추가 지시사항:\n" +
                "   - 제목 이후 한줄을 띄우세요.\n" +
                "   - 제목은 \"(제품명) 판매합니다\" 를 기반으로 톤과 스타일을 반영하세요." +
                "   - 상품이름과 가격을 그대로 사용하세요.\n" +
                "   - 네고 가능 등과 같이 내용에 영향을 미치는 말은 붙이지 마세요.\n" +
                "   - 제목에는 수식어들을 붙이지 말고 작성하세요." +
                "   - 사람들이 사고 싶어 하게끔 작성하세요.";
    }
}
