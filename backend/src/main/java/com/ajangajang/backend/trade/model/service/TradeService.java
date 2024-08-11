package com.ajangajang.backend.trade.model.service;

import com.ajangajang.backend.api.kakaomap.model.service.KakaoApiService;
import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.trade.model.dto.*;
import com.ajangajang.backend.trade.model.entity.Trade;
import com.ajangajang.backend.trade.model.repository.TradeRepository;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TradeService {

    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;

    public Long saveTrade(String username, CreateTradeDto dto) {
        User seller = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        User buyer = userRepository.findById(dto.getBuyerId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Board item = boardRepository.findById(dto.getBoardId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        Trade trade = new Trade(item, seller, buyer);
        return tradeRepository.save(trade).getId(); // 거래내역 생성
    }

    public TradeDto getTradeById(Long id) {
        Trade findTrade = tradeRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.TRADE_NOT_FOUND));
        return new TradeDto(findTrade.getId(), findTrade.getBuyer().getId(), findTrade.getSeller().getId(),
                            findTrade.getItem().getId(), findTrade.getItem().getTitle(), findTrade.getTradeDate());
    }

    public List<TradeDto> getMyBuyingTrades(String username) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        return tradeRepository.findMyBuyingTrades(findUser.getId()).stream()
                .map(trade -> new TradeDto(trade.getId(), trade.getBuyer().getId(), trade.getSeller().getId(),
                                        trade.getItem().getId(), trade.getItem().getTitle(), trade.getTradeDate()))
                .collect(Collectors.toList());
    }

    public List<TradeDto> getMySellingTrades(String username) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        return tradeRepository.findMySellingTrades(findUser.getId()).stream()
                .map(trade -> new TradeDto(trade.getId(), trade.getBuyer().getId(), trade.getSeller().getId(),
                        trade.getItem().getId(), trade.getItem().getTitle(), trade.getTradeDate()))
                .collect(Collectors.toList());
    }

    public void deleteTrade(Long tradeId) {
        Trade trade = tradeRepository.findById(tradeId).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.TRADE_NOT_FOUND));
        tradeRepository.delete(trade);
    }

}
