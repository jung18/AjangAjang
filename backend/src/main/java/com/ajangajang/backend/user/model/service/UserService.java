package com.ajangajang.backend.user.model.service;

import com.ajangajang.backend.user.model.dto.SignUpDto;
import com.ajangajang.backend.user.model.dto.UserInfoDto;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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

    public UserInfoDto findMyInfo(String username) {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            return null;
        }

        UserInfoDto userInfoDto = new UserInfoDto(user.getName(), user.getEmail(), user.getNickname(),
                user.getPhone(), user.getKidAge(), user.getKidGender(), user.getProfileImg());

        return userInfoDto;
    }

    public UserInfoDto findUserInfo(Long id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return null;
        }

        UserInfoDto userInfoDto = new UserInfoDto(user.getName(), user.getEmail(), user.getNickname(),
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
