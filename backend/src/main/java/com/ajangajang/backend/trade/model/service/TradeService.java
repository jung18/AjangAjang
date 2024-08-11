package com.ajangajang.backend.trade.model.service;

import com.ajangajang.backend.board.model.dto.BoardListDto;
import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.entity.Status;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.board.model.service.BoardService;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.trade.model.dto.*;
import com.ajangajang.backend.trade.model.entity.Trade;
import com.ajangajang.backend.trade.model.repository.TradeRepository;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TradeService {

    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final BoardService boardService;

    // 거래내역 생성 -> 판매완료
    public Long saveTrade(String username, CreateTradeDto dto) {
        User seller = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        User buyer = userRepository.findById(dto.getBuyerId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Board item = boardRepository.findById(dto.getBoardId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        item.setStatus(Status.SOLD_OUT);
        Trade trade = new Trade(item, seller, buyer);
        return tradeRepository.save(trade).getId(); // 거래내역 생성
    }

    public TradeDto getTradeById(Long id) {
        Trade findTrade = tradeRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.TRADE_NOT_FOUND));
        return new TradeDto(findTrade.getId(), findTrade.getBuyer().getId(), findTrade.getSeller().getId(),
                            findTrade.getItem().getId(), findTrade.getItem().getTitle(), findTrade.getTradeDate());
    }

    public List<BoardListDto> getMyBuyingTrades(String username) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        List<Board> myBuyingBoards = boardRepository.findMyBuyingBoards(findUser.getId());
        return boardService.getBoardListDtos(myBuyingBoards);
    }

    public List<BoardListDto> getMySellingTrades(String username) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        List<Board> mySellingBoards = boardRepository.findMySellingBoards(findUser.getId());
        return boardService.getBoardListDtos(mySellingBoards);
    }

    public void deleteTrade(Long tradeId) {
        Trade trade = tradeRepository.findById(tradeId).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.TRADE_NOT_FOUND));
        tradeRepository.delete(trade);
    }

}
