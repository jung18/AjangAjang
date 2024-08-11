package com.ajangajang.backend.trade.controller;

import com.ajangajang.backend.board.model.dto.BoardListDto;
import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.trade.model.dto.CreateRecommendDto;
import com.ajangajang.backend.trade.model.dto.CreateTradeDto;
import com.ajangajang.backend.trade.model.dto.TradeDto;
import com.ajangajang.backend.trade.model.dto.TradeListDto;
import com.ajangajang.backend.trade.model.service.TradeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/trade")
@RequiredArgsConstructor
public class TradeApiController {

    private final TradeService tradeService;

    @PostMapping
    public ResponseEntity<?> saveTrade(@RequestBody CreateTradeDto createTradeDto,
                                       @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        Long tradeId = tradeService.saveTrade(username, createTradeDto);
        return ResponseEntity.ok(Map.of("tradeId", tradeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTradeById(@PathVariable("id") Long tradeId) {
        TradeDto result = tradeService.getTradeById(tradeId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyBuyingTrades(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        List<BoardListDto> buyingTrades = tradeService.getMyBuyingTrades(username);
        List<BoardListDto> sellingTrades = tradeService.getMySellingTrades(username);
        TradeListDto tradeList = new TradeListDto(buyingTrades, sellingTrades);
        return new ResponseEntity<>(tradeList, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrade(@PathVariable("id") Long tradeId) {
        tradeService.deleteTrade(tradeId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
