package com.ajangajang.backend.user.model.repository;

import com.ajangajang.backend.user.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

    @Query(value = "SELECT a.* FROM address a " +
            "JOIN user_address ua ON a.id = ua.address_id " +
            "WHERE ua.user_id = :userId", nativeQuery = true)
    List<Address> findMyAddresses(@Param("userId") Long userId);

    Address findByFullAddress(String fullAddress);

}
