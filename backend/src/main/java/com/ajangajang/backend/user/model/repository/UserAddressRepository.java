package com.ajangajang.backend.user.model.repository;

import com.ajangajang.backend.user.model.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {

    UserAddress findByUserIdAndAddressId(Long userId, Long addressId);

    List<UserAddress> findByUserId(Long userId);

}
