package com.ajangajang.backend.api.kakaomap.model.service;

import com.ajangajang.backend.api.kakaomap.model.entity.Address;
import com.ajangajang.backend.api.kakaomap.model.repository.AddressRepository;
import com.ajangajang.backend.api.kakaomap.model.repository.NearbyRegionsRepository;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoMapApiService {

    @Value("${kakao.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final AddressRepository addressRepository;
    private final NearbyRegionsRepository regionsRepository;

    public void callApiByCSV() {
        String filePath = "C:/Users/SSAFY/Documents/location_data.csv";
        String line;
        String csvSplitBy = ","; // CSV 파일의 구분자

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            while ((line = br.readLine()) != null) {
                String[] data = line.split(csvSplitBy);
                // 동단위까지 없는 행은 제외
                if (data[1].equals("") || data[2].equals("") || data[3].equals("")) {
                    continue;
                }
                // 주소 데이터로 api 호출
                String address = String.join(" ", data[1], data[2], data[3]); // ~시 ~구 ~동
                getCoordinatesByAddressApi(address);
            }
        } catch (IOException e) {
            log.info("{}", e.getMessage());
        }
    }

    private void getCoordinatesByAddressApi(String address) {
        // 행정구역 정보 API
        String apiUrl = "https://dapi.kakao.com/v2/local/search/address.json?query=" + address;

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + apiKey);
        // API 호출
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.GET,
                entity,
                String.class
        );
        log.info("{}", address);

        try {
            JSONObject jsonObject = new JSONObject(response.getBody());
            JSONArray jsonArray = jsonObject.getJSONArray("documents");
            JSONObject documents = jsonArray.getJSONObject(0);
            // 위도, 경도 추출
            double longitude = Double.parseDouble(documents.getString("x"));
            double latitude = Double.parseDouble(documents.getString("y"));
            // 주소지 추출
            JSONObject addressInfo = documents.getJSONObject("address");
            String sido = addressInfo.getString("region_1depth_name");
            String sigg = addressInfo.getString("region_2depth_name");
            String emd = addressInfo.getString("region_3depth_name");
            String addressCode = addressInfo.getString("b_code");
            // Address 테이블에 저장
            saveAddress(sido, sigg, emd, longitude, latitude, addressCode);
        } catch (Exception e) {
            log.info("{}", e.getMessage());
        }
    }

    private void saveAddress(String sido, String sigg, String emd,
                             double longitude, double latitude, String addressCode) {
        boolean isExist = addressRepository.existsByAddressCode(addressCode);
        if (!isExist) {
            Address address = new Address(sido, sigg, emd, longitude, latitude, addressCode);
            addressRepository.save(address);
        }
    }

    public void saveNearbyAddresses() {
        addressRepository.saveNearbyRegion();
    }

    public List<String> getAddressByCoordinatesApi(double longitude, double latitude) {
        String apiUrl = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=" + longitude + "&y=" + latitude;
        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + apiKey);
        // API 호출
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.GET,
                entity,
                String.class
        );

        try {
            JSONObject jsonObject = new JSONObject(response.getBody());
            JSONArray jsonArray = jsonObject.getJSONArray("documents");
            JSONObject documents = jsonArray.getJSONObject(0);
            String sido = documents.getString("region_1depth_name");
            String sigg = documents.getString("region_2depth_name");
            String emd = documents.getString("region_3depth_name");
            String addressCode = documents.getString("code");
            return List.of(addressCode, sido, sigg, emd);
        } catch (Exception e) {
            log.info("{}", e.getMessage());
            throw new CustomGlobalException(CustomStatusCode.API_CALL_FAILED);
        }
    }

    public List<Address> getNearbyAddresses(String addressCode, String type) {
        Address findAddress = addressRepository.findByAddressCode(addressCode)
                .orElseThrow(() -> new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND));
        return switch (type) {
            case "FAR" -> regionsRepository.findFarById(findAddress.getId());
            case "MEDIUM" -> regionsRepository.findMediumById(findAddress.getId());
            case "CLOSE" -> regionsRepository.findCloseById(findAddress.getId());
            default -> throw new CustomGlobalException(CustomStatusCode.INVALID_NEAR_TYPE);
        };
    }

}
