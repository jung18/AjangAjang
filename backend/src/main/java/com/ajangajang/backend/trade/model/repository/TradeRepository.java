package com.ajangajang.backend.trade.model.repository;

import com.ajangajang.backend.trade.model.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, Long> {

    @Query("select t from Trade t join fetch t.buyer b where b.id = :userId")
    List<Trade> findMyBuyingTrades(Long userId);

    @Query("select t from Trade t join fetch t.seller s where s.id = :userId")
    List<Trade> findMySellingTrades(Long userId);

}
