package com.ajangajang.backend.trade.model.service;

import com.ajangajang.backend.api.kakaomap.model.service.KakaoApiService;
import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.trade.model.dto.*;
import com.ajangajang.backend.trade.model.entity.Trade;
import com.ajangajang.backend.trade.model.repository.TradeRepository;
import com.ajangajang.backend.user.model.dto.AddressDto;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TradeService {

    private final KakaoApiService kakaoApiService;

    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;

    public SaveTradeResult saveTrade(String username, CreateTradeDto dto) {
        User buyer = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        User seller = userRepository.findById(dto.getSellerId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Board item = boardRepository.findById(dto.getBoardId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        Trade trade = new Trade(item, seller, buyer);
        Trade savedTrade = tradeRepository.save(trade); // 거래내역 생성
        // 장소 추천
        List<RecommendDto> recommendLocations = recommendTradeLocations(buyer, dto);

        return new SaveTradeResult(savedTrade.getId(), recommendLocations);
    }

    public TradeDto getTradeById(Long id) {
        Trade findTrade = tradeRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.TRADE_NOT_FOUND));
        return new TradeDto(findTrade.getId(), findTrade.getSeller().getId(), findTrade.getItem().getId(),
                            findTrade.getItem().getTitle(), findTrade.getTradeDate());
    }

    public List<TradeDto> getMyTrades(String username) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        return tradeRepository.findMyTrades(findUser.getId()).stream()
                .map(trade -> new TradeDto(trade.getId(), trade.getSeller().getId(), trade.getItem().getId(),
                                        trade.getItem().getTitle(), trade.getTradeDate()))
                .collect(Collectors.toList());
    }

    public void deleteTrade(Long tradeId) {
        Trade trade = tradeRepository.findById(tradeId).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.TRADE_NOT_FOUND));
        tradeRepository.delete(trade);
    }

    private List<RecommendDto> recommendTradeLocations(User buyer, CreateTradeDto dto) {
        double buyerX = buyer.getMainAddress().getLongitude();
        double buyerY = buyer.getMainAddress().getLatitude();
        List<RecommendDto> result;

        if (dto.getRecommendType() == RecommendType.SELLER) { // 판매자 근처
            result = kakaoApiService.findRecommendLocation(dto.getLongitude(), dto.getLatitude());
        } else if (dto.getRecommendType() == RecommendType.MIDDLE) { // 중간
            double[] midpoint = calculateMidpoint(buyerX, buyerY, dto.getLongitude(), dto.getLatitude());
            result = kakaoApiService.findRecommendLocation(midpoint[0], midpoint[1]);
        } else { // 구매자 근처
            result = kakaoApiService.findRecommendLocation(buyerX, buyerY);
        }
        return result;
    }

    private static double[] calculateMidpoint(double lon1, double lat1, double lon2, double lat2) {
        // 위도와 경도의 평균을 계산
        double midLat = (lat1 + lat2) / 2.0;
        double midLon = (lon1 + lon2) / 2.0;

        return new double[]{midLon, midLat};
    }

}
