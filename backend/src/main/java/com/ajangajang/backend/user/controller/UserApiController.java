package com.ajangajang.backend.user.controller;

import com.ajangajang.backend.board.model.dto.BoardListDto;
import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.user.model.dto.ChildInputDto;
import com.ajangajang.backend.user.model.dto.ChildListDto;
import com.ajangajang.backend.user.model.dto.UserInfoDto;
import com.ajangajang.backend.user.model.dto.UserInputDto;
import com.ajangajang.backend.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
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

    @GetMapping("/my")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        UserInfoDto userInfo = userService.findMyInfo(username);
        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }

    @GetMapping("/my/likes")
    public ResponseEntity<?> getMyLikes(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        List<BoardListDto> result = userService.findMyLikes(username);
        return ResponseEntity.ok(Map.of("data", result));
    }

    @GetMapping("/my/boards")
    public ResponseEntity<?> getMyBoards(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        List<BoardListDto> result = userService.findMyBoards(username);
        return ResponseEntity.ok(Map.of("data", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserInfo(@PathVariable("id") Long id) {
        UserInfoDto userInfo = userService.findUserInfo(id);
        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }

    @PutMapping("/my")
    public ResponseEntity<?> updateMyInfo(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                          @RequestBody UserInputDto userInputDto) {
        String username = customOAuth2User.getUsername();
        userService.updateMyInfo(username, userInputDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/my")
    public ResponseEntity<?> deleteMyInfo(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        userService.deleteUser(username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/child")
    public ResponseEntity<?> addKid(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                    @RequestBody ChildInputDto childInputDto) {
        String username = customOAuth2User.getUsername();
        userService.addChild(username, childInputDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/child/{childId}")
    public ResponseEntity<?> deleteKid(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                       @PathVariable("childId") Long childId) {
        String username = customOAuth2User.getUsername();
        userService.deleteChild(username, childId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/child")
    public ResponseEntity<?> getKids(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        List<ChildListDto> result = userService.findMyChildren(username);
        return new ResponseEntity<>(Map.of("data", result), HttpStatus.OK);
    }

    @PostMapping("/child/{childId}")
    public ResponseEntity<?> changeMainChild(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                             @PathVariable("childId") Long childId) {
        String username = customOAuth2User.getUsername();
        userService.changeMainChild(username, childId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
