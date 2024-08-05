package com.ajangajang.backend.user.model.repository;

import com.ajangajang.backend.user.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {

    Address findByAddressCode(String addressCode);

}
