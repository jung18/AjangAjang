package com.ajangajang.backend.user.controller;

import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.user.model.dto.SignUpDto;
import com.ajangajang.backend.user.model.dto.UserInfoDto;
import com.ajangajang.backend.user.model.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserApiController {

    private final UserService userService;

    @GetMapping("/my")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        String username = customOAuth2User.getUsername();

        UserInfoDto userInfo = userService.findMyInfo(username);

        if (userInfo == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserInfo(@PathVariable("id") Long id) {

        UserInfoDto userInfo = userService.findUserInfo(id);

        if (userInfo == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(userInfo, HttpStatus.OK);
    }

    @PutMapping("/my")
    public ResponseEntity<?> updateMyInfo(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                          @Valid @RequestBody SignUpDto signUpDto, BindingResult bindingResult) {

        String username = customOAuth2User.getUsername();

        if (userService.signUp(username, signUpDto) == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("my")
    public ResponseEntity<?> deleteMyInfo(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        String username = customOAuth2User.getUsername();

        if (userService.deleteUser(username)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
