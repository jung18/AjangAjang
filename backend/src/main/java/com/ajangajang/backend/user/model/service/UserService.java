package com.ajangajang.backend.user.model.service;

import com.ajangajang.backend.board.model.service.FileService;
import com.ajangajang.backend.user.model.dto.SignUpDto;
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

    public User signUp(SignUpDto signUpDto, String username) {

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
            return null;
        }
        String profileUrl = fileService.uploadProfileImage(profile);
        user.setProfileImg(profileUrl);
        return profileUrl;
    }

    public boolean updateProfileImage(MultipartFile profile, String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return false;
        }
        fileService.delete(user.getProfileImg());
        String profileUrl = fileService.uploadProfileImage(profile);
        user.setProfileImg(profileUrl);
        return true;
    }

    public boolean deleteProfileImage(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return false;
        }
        fileService.delete(user.getProfileImg());
        user.setProfileImg(null);
        return true;
    }

}
