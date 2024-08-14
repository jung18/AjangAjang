package com.ajangajang.backend.user.controller;

import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.trade.model.dto.CreateRecommendDto;
import com.ajangajang.backend.trade.model.dto.RecommendDto;
import com.ajangajang.backend.user.model.dto.*;
import com.ajangajang.backend.user.model.service.UserAddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressApiController {

    private final UserAddressService userAddressService;

    @PostMapping("/name")
    public ResponseEntity<?> saveAddresses(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                           @RequestBody AddressNameDto address) {
        String username = customOAuth2User.getUsername();
        AddressDto result = userAddressService.saveAddressInfo(username, address.getAddressName());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/xy")
    public ResponseEntity<?> saveAddresses(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                           @RequestBody CoordinateDto xy) {
        String username = customOAuth2User.getUsername();
        AddressDto result = userAddressService.saveAddressInfo(username, xy.getLongitude(), xy.getLatitude());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    public ResponseEntity<?> findMyAddresses(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        List<AddressDto> result = userAddressService.findMyAddresses(username);
        return new ResponseEntity<>(Map.of("data", result), HttpStatus.OK);
    }

    @DeleteMapping("/my/{id}")
    public ResponseEntity<?> deleteMyAddress(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                             @PathVariable Long id) {
        String username = customOAuth2User.getUsername();
        userAddressService.deleteAddress(username, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/main")
    public ResponseEntity<?> saveMainAddress(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                             @RequestBody MainAddressDto dto) {
        String username = customOAuth2User.getUsername();
        Long mainAddressId = userAddressService.saveMainAddress(username, dto);
        return new ResponseEntity<>(Map.of("id", mainAddressId), HttpStatus.OK);
    }

    @PostMapping("/main/range")
    public ResponseEntity<?> updateNearType(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                            @RequestBody SearchRangeDto searchRangeDto) {
        String username = customOAuth2User.getUsername();
        String nearType = userAddressService.updateNearType(username, searchRangeDto);
        return new ResponseEntity<>(Map.of("nearType", nearType), HttpStatus.OK);
    }

    @PostMapping("/recommend")
    public ResponseEntity<?> getRecommendAddresses(@RequestBody CreateRecommendDto dto) {
        List<RecommendDto> result = userAddressService.getRecommendLocations(dto);
        return new ResponseEntity<>(Map.of("data", result), HttpStatus.OK);
    }

}
