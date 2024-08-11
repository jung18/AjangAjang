package com.ajangajang.backend.api.kakaomap.model.service;

import com.ajangajang.backend.api.kakaomap.model.entity.Regions;
import com.ajangajang.backend.api.kakaomap.model.repository.RegionsRepository;
import com.ajangajang.backend.api.kakaomap.model.repository.NearbyRegionsRepository;
import com.ajangajang.backend.elasticsearch.model.document.AddressDocument;
import com.ajangajang.backend.elasticsearch.model.repository.AddressSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegionDataService {

    @Value("${kakao.api.key}")
    private String apiKey;

    private final RegionsRepository regionsRepository;
    private final KakaoApiService kakaoApiService;
    private final NearbyRegionsRepository nearbyRegionsRepository;
    private final AddressSearchRepository addressSearchRepository;

    public void callApiByCSV() {
        String filePath = "/home/ubuntu/location_data.csv";
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
                getRegionData(address);
            }
        } catch (IOException e) {
            log.info("{}", e.getMessage());
        }
    }

    private void getRegionData(String address) {
        String apiUrl = "https://dapi.kakao.com/v2/local/search/address.json?query=" + address;
        ResponseEntity<String> response = kakaoApiService.callApiAndGetResponse(apiUrl);

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
            saveRegions(sido, sigg, emd, longitude, latitude, addressCode);
        } catch (Exception e) {
            log.info("{}", e.getMessage());
        }
    }

    private void saveRegions(String sido, String sigg, String emd,
                             double longitude, double latitude, String addressCode) {
        boolean isExist = regionsRepository.existsByAddressCode(addressCode);
        if (!isExist) {
            Regions regions = new Regions(sido, sigg, emd, longitude, latitude, addressCode);
            regionsRepository.save(regions);
        }
    }

    public void saveRegionsByJson() {

        String filePath = "/home/ubuntu/data-test.json";
        File file = new File(filePath);

        if (!file.exists()) {
            log.error("File does not exist: {}", filePath);
            return;
        }

        try {
            // 파일에서 JSON 문자열 읽어오기
            String content = new String(Files.readAllBytes(Paths.get(filePath)));

            log.info("파일 읽기");
            // JSON 문자열을 JSONArray로 변환
            JSONArray jsonArray = new JSONArray(content);

            // JSONArray에서 각 객체를 하나씩 처리
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                log.info(jsonObject.getString("emd"));
                Regions regions = new Regions(jsonObject.getString("sido"), jsonObject.getString("sigg"),
                        jsonObject.getString("emd"), jsonObject.getDouble("longitude"),
                        jsonObject.getDouble("latitude"), jsonObject.getString("address_code"));
                regionsRepository.save(regions);
            }
        } catch (IOException e) {
            log.info("IOException 에러");
            log.info("{}", e.getMessage());
        }
    }

    public void saveNearbyRegions() {
        regionsRepository.saveNearbyRegion();
    }

    public void saveRegionsES() {
        List<Regions> allRegions = regionsRepository.findAll();
        for (Regions region : allRegions) {
            List<String> closeById = nearbyRegionsRepository.findCloseById(region.getId());
            List<String> mediumById = nearbyRegionsRepository.findMediumById(region.getId());
            List<String> farById = nearbyRegionsRepository.findFarById(region.getId());
            addressSearchRepository.save(AddressDocument.from(region, closeById, mediumById, farById));
        }
    }

}
