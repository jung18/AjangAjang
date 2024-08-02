package com.ajangajang.backend.api.kakaomap.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
public class NearbyRegions {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "current_id")
    private Address current;
    @ManyToOne
    @JoinColumn(name = "nearby_id")
    private Address nearby;

    @Enumerated(EnumType.STRING)
    private NearType nearType;

}
