package com.ajangajang.backend.api.kakaomap.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter
@Setter
public class NearbyRegions {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "current_id")
    private Regions current;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "nearby_id")
    private Regions nearby;

    @Enumerated(EnumType.STRING)
    private NearType nearType;

}
