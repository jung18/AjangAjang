package com.ajangajang.backend.api.kakaomap.model.service;

import com.ajangajang.backend.api.kakaomap.model.entity.Regions;
import com.ajangajang.backend.api.kakaomap.model.repository.NearbyRegionsRepository;
import com.ajangajang.backend.api.kakaomap.model.repository.RegionsRepository;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.user.model.dto.AddressDto;
import com.ajangajang.backend.user.model.entity.Address;
import com.ajangajang.backend.user.model.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoApiService {

    @Value("${kakao.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final RegionsRepository regionsRepository;
    private final NearbyRegionsRepository nearbyRegionsRepository;
    private final AddressRepository addressRepository;

    public ResponseEntity<String> callApiAndGetResponse(String apiUrl) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + apiKey);
        // API 호출
        HttpEntity<String> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(
                apiUrl,
                HttpMethod.GET,
                entity,
                String.class
        );
    }

    public Address getAddressByAddressName(String inputAddress) {
        String apiUrl = "https://dapi.kakao.com/v2/local/search/address.json?query=" + inputAddress;
        ResponseEntity<String> response = callApiAndGetResponse(apiUrl);

        try {
            JSONObject jsonObject = new JSONObject(response);
            JSONArray jsonArray = jsonObject.getJSONArray("documents");
            JSONObject documents = jsonArray.getJSONObject(0);

            String addressName = documents.getString("address_name"); // full address
            JSONObject address = documents.getJSONObject("address");

            String sido = address.getString("region_1depth_name");
            String sigg = address.getString("region_2depth_name");
            String emd = address.getString("region_3depth_name");
            String bCode = address.getString("b_code");
            double longitude = Double.parseDouble(address.getString("x"));
            double latitude = Double.parseDouble(address.getString("y"));
            return new Address(sido, sigg, emd, addressName, longitude, latitude, bCode);

        } catch (Exception e) {
            log.info(e.getMessage());
            throw new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND);
        }
    }

    public Address getAddressByCoordinates(double longitude, double latitude) {
        String apiUrl = "https://dapi.kakao.com/v2/local/geo/coord2address.json?x=" + longitude + "&y=" + latitude;
        ResponseEntity<String> response = callApiAndGetResponse(apiUrl);

        try {
            JSONObject jsonObject = new JSONObject(response);
            JSONArray jsonArray = jsonObject.getJSONArray("documents");
            JSONObject documents = jsonArray.getJSONObject(0);
            JSONObject addressInfo = documents.getJSONObject("address");
            // address
            String addressName = addressInfo.getString("address_name");
            String sido = addressInfo.getString("region_1depth_name");
            String sigg = addressInfo.getString("region_2depth_name");
            String emd = addressInfo.getString("region_3depth_name");
            //regionCode
            String bCode = getBcodeByCoordinates(longitude, latitude);
            return new Address(sido, sigg, emd, addressName, longitude, latitude, bCode);

        } catch (Exception e) {
            log.info(e.getMessage());
            throw new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND);
        }
    }

    private String getBcodeByCoordinates(double longitude, double latitude) throws Exception {
        String apiUrl = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=" + longitude + "&y=" + latitude;
        ResponseEntity<String> response = callApiAndGetResponse(apiUrl);

        JSONObject jsonObject = new JSONObject(response);
        JSONArray jsonArray = jsonObject.getJSONArray("documents");
        JSONObject documents = jsonArray.getJSONObject(0);
        return documents.getString("code");
    }

    public List<Regions> getNearbyRegions(String addressCode, String type) {
        Regions findRegions = regionsRepository.findByAddressCode(addressCode)
                .orElseThrow(() -> new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND));
        return switch (type) {
            case "FAR" -> nearbyRegionsRepository.findFarById(findRegions.getId());
            case "MEDIUM" -> nearbyRegionsRepository.findMediumById(findRegions.getId());
            case "CLOSE" -> nearbyRegionsRepository.findCloseById(findRegions.getId());
            default -> throw new CustomGlobalException(CustomStatusCode.INVALID_NEAR_TYPE);
        };
    }

}
