package com.ajangajang.backend.api.kakaomap.model.repository;

import com.ajangajang.backend.api.kakaomap.model.entity.Address;
import com.ajangajang.backend.api.kakaomap.model.entity.NearbyRegions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NearbyRegionsRepository extends JpaRepository<NearbyRegions, Long> {

    @Query("SELECT nr.nearby FROM NearbyRegions nr " +
            "WHERE nr.current.id = :currentId " +
            "AND nr.nearType in (com.ajangajang.backend.api.kakaomap.model.entity.NearType.CLOSE, " +
                                "com.ajangajang.backend.api.kakaomap.model.entity.NearType.MEDIUM, " +
                                "com.ajangajang.backend.api.kakaomap.model.entity.NearType.FAR)")
    List<Address> findFarById(@Param("currentId") Long currentId);

    @Query("SELECT nr.nearby FROM NearbyRegions nr " +
            "WHERE nr.current.id = :currentId " +
            "AND nr.nearType in (com.ajangajang.backend.api.kakaomap.model.entity.NearType.CLOSE, " +
                                "com.ajangajang.backend.api.kakaomap.model.entity.NearType.MEDIUM)")
    List<Address> findMediumById(@Param("currentId") Long currentId);

    @Query("SELECT nr.nearby FROM NearbyRegions nr " +
            "WHERE nr.current.id = :currentId " +
            "AND nr.nearType = 'CLOSE'")
    List<Address> findCloseById(@Param("currentId") Long currentId);

}
