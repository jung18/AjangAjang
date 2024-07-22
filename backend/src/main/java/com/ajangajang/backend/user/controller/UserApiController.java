package com.ajangajang.backend.user.controller;

import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserApiController {

    private final UserService userService;

    @PostMapping("/profile")
    public ResponseEntity<?> saveProfileImage(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                         @RequestBody MultipartFile profile) {
        String username = customOAuth2User.getUsername();
        String profileUrl = userService.saveProfileImage(profile, username);
        return ResponseEntity.ok(Map.of("profileUrl", profileUrl));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfileImage(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                                @RequestBody MultipartFile profile) {
        String username = customOAuth2User.getUsername();
        userService.updateProfileImage(profile, username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteProfileImage(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        userService.deleteProfileImage(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
