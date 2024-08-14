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
import com.ajangajang.backend.user.model.dto.UserProfileDto;
import com.ajangajang.backend.user.model.entity.Address;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import com.ajangajang.backend.user.model.service.LevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    private final LevelService levelService;

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

    public List<TradeInfoDto> getMyBuyingTrades(String username) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        List<Board> myBuyingBoards = boardRepository.findMyBuyingBoards(findUser.getId());
        return getTradeInfoDtos(myBuyingBoards);
    }

    public List<TradeInfoDto> getMySellingTrades(String username) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        List<Board> mySellingBoards = boardRepository.findMySellingBoards(findUser.getId());
        return getTradeInfoDtos(mySellingBoards);
    }

    public void deleteTrade(Long tradeId) {
        Trade trade = tradeRepository.findById(tradeId).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.TRADE_NOT_FOUND));
        tradeRepository.delete(trade);
    }

    public List<TradeInfoDto> getTradeInfoDtos(List<Board> boards) {
        List<TradeInfoDto> result = new ArrayList<>();
        for (Board board : boards) {
            User writer = board.getWriter();
            Long tradeId = board.getTrade().getId();
            String thumbnail = boardService.getThumbnail(board);
            Address address = board.getAddress();
            String addressName = address.getSigg() + address.getEmd();
            UserProfileDto profile = new UserProfileDto(writer.getId(), writer.getNickname(),
                    writer.getProfileImg(), levelService.getLevel(writer.getScore()));
            BoardListDto boardListDto = new BoardListDto(board.getId(), thumbnail, profile, board.getTitle(),
                    board.getPrice(), addressName, board.getCategory().name(), board.getStatus(),
                    board.getLikedUsers().size(), board.getViewCount());
            result.add(new TradeInfoDto(boardListDto, tradeId));
        }
        return result;
    }

}
