package com.ajangajang.backend.api.kakaomap.model.repository;

import com.ajangajang.backend.api.kakaomap.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    @Query("select COUNT(a) > 0 from Address a where a.addressCode = :addressCode")
    boolean existsByAddressCode(@Param("addressCode") String addressCode);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO nearby_regions (current_id, nearby_id, near_type) " +
            "SELECT a1.id, a2.id, " +
            "       CASE\n" +
            "           WHEN ( 6371 * acos( cos( radians(a1.latitude) ) " +
            "                              * cos( radians(a2.latitude) ) " +
            "                              * cos( radians(a2.longitude) - radians(a1.longitude) ) " +
            "                              + sin( radians(a1.latitude) ) * sin( radians(a2.latitude) ) ) ) <= 5 " +
            "               THEN 'CLOSE' " +
            "           WHEN ( 6371 * acos( cos( radians(a1.latitude) ) " +
            "                              * cos( radians(a2.latitude) ) " +
            "                              * cos( radians(a2.longitude) - radians(a1.longitude) ) " +
            "                              + sin( radians(a1.latitude) ) * sin( radians(a2.latitude) ) ) ) <= 10 " +
            "               THEN 'MEDIUM' " +
            "           WHEN ( 6371 * acos( cos( radians(a1.latitude) ) " +
            "                              * cos( radians(a2.latitude) ) " +
            "                              * cos( radians(a2.longitude) - radians(a1.longitude) ) " +
            "                              + sin( radians(a1.latitude) ) * sin( radians(a2.latitude) ) ) ) <= 15 " +
            "               THEN 'FAR' " +
            "           ELSE NULL " +
            "       END AS distance_category " +
            "FROM address a1, address a2 " +
            "WHERE a1.id <> a2.id " +
            "  AND ( 6371 * acos( cos( radians(a1.latitude) ) " +
            "                     * cos( radians(a2.latitude) ) " +
            "                     * cos( radians(a2.longitude) - radians(a1.longitude) ) " +
            "                     + sin( radians(a1.latitude) ) * sin( radians(a2.latitude) ) ) ) <= 15", nativeQuery = true)
    void saveNearbyRegion();

    Optional<Address> findByAddressCode(@Param("addressCode") String addressCode);

}
