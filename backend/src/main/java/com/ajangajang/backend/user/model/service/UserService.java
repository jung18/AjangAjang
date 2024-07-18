package com.ajangajang.backend.user.model.service;

import com.ajangajang.backend.user.model.dto.SignUpDto;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
}
