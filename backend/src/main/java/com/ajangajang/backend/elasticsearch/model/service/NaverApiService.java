package com.ajangajang.backend.elasticsearch.model.service;

import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class NaverApiService {

    private final RestTemplate restTemplate;

    @Value("${OAUTH_NAVER_ID}")
    private String clientId;

    @Value("${OAUTH_NAVER_PW}")
    private String clientSecret;

    public ResponseEntity<String> callApiAndGetResponse(String apiUrl) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(
                apiUrl,
                HttpMethod.GET,
                entity,
                String.class
        );
    }

    public String checkQuery(String query) {
        String apiUrl = "https://openapi.naver.com/v1/search/errata.json?query=" + query;
        ResponseEntity<String> response = callApiAndGetResponse(apiUrl);

        try {
            JSONObject jsonObject = new JSONObject(response.getBody());
            return jsonObject.getString("errata");
        } catch (Exception e) {
            log.info(e.getMessage());
            throw new CustomGlobalException(CustomStatusCode.API_CALL_FAILED);
        }
    }
}
