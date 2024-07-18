package com.ajangajang.backend.user.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username; // 식별 아이디

    private String name;
    private String role;
    private String email;

    private String nickname;
    private String phone;
    private int kidAge;
    private int kidGender;
    private String profileImg;
}
