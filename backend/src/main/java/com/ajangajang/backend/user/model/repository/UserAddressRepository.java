package com.ajangajang.backend.user.model.repository;

import com.ajangajang.backend.user.model.entity.Address;
import com.ajangajang.backend.user.model.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {

    @Query(value = "SELECT a.* FROM address a " +
            "JOIN user_address ua ON a.id = ua.address_id " +
            "WHERE ua.user_id = :userId", nativeQuery = true)
    List<Address> findMyAddresses(Long userId);

    Optional<UserAddress> findByUserIdAndAddressId(Long userId, Long addressId);

    void deleteByUserIdAndAddressId(Long userId, Long addressId);

}
