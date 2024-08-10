package com.ajangajang.backend.trade.model.entity;

import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.user.model.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Trade {

    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime tradeDate;

    @OneToOne(fetch = LAZY)
    @JoinColumn(name = "item_id")
    private Board item; // 거래상품(판매글)

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "buyer_id")
    private User buyer;

    public Trade(Board item, User seller, User buyer) {
        this.item = item;
        this.seller = seller;
        this.buyer = buyer;
    }
}
