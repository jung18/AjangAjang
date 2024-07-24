package com.ajangajang.backend.user.model.service;

import com.ajangajang.backend.board.model.service.FileService;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.user.model.dto.UserInfoDto;
import com.ajangajang.backend.user.model.dto.UserInputDto;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileService fileService;

    public void signUp(String username, UserInputDto userInputDto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        user.setNickname(userInputDto.getNickname());
        user.setPhone(userInputDto.getPhone());
        user.setRole("ROLE_USER");
        userRepository.save(user);
    }

    public String saveProfileImage(MultipartFile profile, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        String profileUrl = fileService.uploadProfileImage(profile);
        user.setProfileImg(profileUrl);
        return profileUrl;
    }

    public void updateProfileImage(MultipartFile profile, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        fileService.delete(user.getProfileImg());
        String profileUrl = fileService.uploadProfileImage(profile);
        user.setProfileImg(profileUrl);
    }

    public void deleteProfileImage(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        fileService.delete(user.getProfileImg());
        user.setProfileImg(null);
    }

    public UserInfoDto findMyInfo(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        UserInfoDto userInfoDto = new UserInfoDto(user.getNickname(), user.getProfileImg());
        return userInfoDto;
    }

    public UserInfoDto findUserInfo(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        UserInfoDto userInfoDto = new UserInfoDto(user.getNickname(), user.getProfileImg());
        return userInfoDto;
    }

    public void updateMyInfo(String username, UserInputDto userInputDto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        user.setNickname(userInputDto.getNickname());
        user.setPhone(userInputDto.getPhone());
        userRepository.save(user);
    }

    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        userRepository.delete(user);
    }

}
