package com.ajangajang.backend.user.model.service;

import com.ajangajang.backend.board.model.service.FileService;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.user.model.dto.SignUpDto;
import com.ajangajang.backend.user.model.dto.UserInfoDto;
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

    public User signUp(String username, SignUpDto signUpDto) {

        User user = userRepository.findByUsername(username);
        user.setNickname(signUpDto.getNickname());
        user.setPhone(signUpDto.getPhone());
        user.setKidAge(signUpDto.getKidAge());
        user.setKidGender(signUpDto.getKidGender());
        user.setRole("ROLE_USER");

        try {
            return userRepository.save(user);
        } catch (Exception e) {
            return null;
        }
    }

    public String saveProfileImage(MultipartFile profile, String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND);
        }
        String profileUrl = fileService.uploadProfileImage(profile);
        user.setProfileImg(profileUrl);
        return profileUrl;
    }

    public void updateProfileImage(MultipartFile profile, String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND);
        }
        fileService.delete(user.getProfileImg());
        String profileUrl = fileService.uploadProfileImage(profile);
        user.setProfileImg(profileUrl);
    }

    public void deleteProfileImage(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND);
        }
        fileService.delete(user.getProfileImg());
        user.setProfileImg(null);

    public UserInfoDto findMyInfo(String username) {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            return null;
        }

        UserInfoDto userInfoDto = new UserInfoDto(user.getName(), user.getNickname(),
                user.getPhone(), user.getKidAge(), user.getKidGender(), user.getProfileImg());

        return userInfoDto;
    }

    public UserInfoDto findUserInfo(Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return null;
        }

        UserInfoDto userInfoDto = new UserInfoDto(user.getName(), user.getNickname(),
                user.getPhone(), user.getKidAge(), user.getKidGender(), user.getProfileImg());

        return userInfoDto;
    }

    public boolean deleteUser(String username) {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            return false;
        }

        userRepository.delete(user);
        return true;
    }

}
