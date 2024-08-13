package com.ajangajang.backend.board.controller;

import com.ajangajang.backend.board.model.dto.*;
import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.entity.Category;
import com.ajangajang.backend.board.model.service.BoardLikeService;
import com.ajangajang.backend.board.model.service.BoardService;
import com.ajangajang.backend.elasticsearch.model.service.BoardSearchService;
import com.ajangajang.backend.elasticsearch.model.service.NaverApiService;
import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.user.model.dto.AddressDto;
import com.ajangajang.backend.user.model.service.UserAddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BoardApiController {

    private final BoardService boardService;
    private final BoardLikeService boardLikeService;
    private final BoardSearchService boardSearchService;
    private final UserAddressService userAddressService;

    @PostMapping("/board")
    public ResponseEntity<?> saveBoard(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                       @RequestPart("board") CreateBoardDto createBoardDto,
                                       @RequestPart(value = "media", required = false) List<MultipartFile> files) {
        String username = customOAuth2User.getUsername();
        Board board = boardService.save(username, createBoardDto, files);
        boardSearchService.save(board);
        Long boardId = board.getId();
        return ResponseEntity.ok(Map.of("boardId", boardId));
    }

    @GetMapping("/board/{id}")
    public ResponseEntity<?> getBoard(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                      @PathVariable("id") Long id) {
        log.info(customOAuth2User.toString());
        String username = customOAuth2User.getUsername();
        log.info(username);
        boardService.increaseRecommendationViewCount(username, id);
        boardService.increaseViewCount(id);
        BoardDto result = boardService.findById(id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/board/all")
    public ResponseEntity<?> getAllBoards(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                          @RequestBody SearchBoardDto searchBoardDto) {
        String username = customOAuth2User.getUsername();
        Page<BoardListDto> searchResult = boardSearchService.getNearbyBoards(username, searchBoardDto);
        List<AddressDto> addressList = userAddressService.findMyAddresses(username);
        SearchResultDto searchResultDto = new SearchResultDto();
        searchResultDto.setSearchResult(searchResult);
        searchResultDto.setAddressList(addressList);
        return new ResponseEntity<>(searchResultDto, HttpStatus.OK);
    }

    @PutMapping("/board/{id}")
    public ResponseEntity<?> updateBoard(@PathVariable("id") Long id,
                            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                            @RequestPart(value = "board", required = false) UpdateBoardDto updateParam,
                            @RequestPart(value = "media", required = false) List<MultipartFile> files) {
        String username = customOAuth2User.getUsername();
        boardService.update(id, username, updateParam, files);
        Board board = boardService.findBoardById(id);
        boardSearchService.save(board);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/board/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable("id") Long id,
                                         @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        boardService.delete(id, username);
        boardSearchService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/board/search")
    public ResponseEntity<?> searchBoard(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                         @RequestBody SearchBoardDto searchBoardDto) {
        String username = customOAuth2User.getUsername();
        SearchResultDto searchResultDto = boardSearchService.getSearchResultDto(username, searchBoardDto);
        return new ResponseEntity<>(searchResultDto, HttpStatus.OK);
    }

    @GetMapping("/user/{id}/boards")
    public ResponseEntity<?> getUserBoards(@PathVariable("id") Long id) {
        List<BoardListDto> result = boardService.findAllByUserId(id);
        return ResponseEntity.ok(Map.of("data", result));
    }

    @PostMapping("/board/{id}/likes")
    public ResponseEntity<?> saveLike(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                       @PathVariable("id") Long id) {
        String username = customOAuth2User.getUsername();
        boardLikeService.likeBoard(username, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/board/{id}/likes")
    public ResponseEntity<?> deleteLike(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                       @PathVariable("id") Long id) {
        String username = customOAuth2User.getUsername();
        boardLikeService.unlikeBoard(username, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/board/recommendation")
    public ResponseEntity<?> getRecommendationBoards(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                                     @RequestBody SearchBoardDto searchBoardDto) {
        String username = customOAuth2User.getUsername();
        Category recommendationCategory = boardService.findRecommendationCategory(username);
        searchBoardDto.setCategory(recommendationCategory.name());
        searchBoardDto.setTitle("");
        searchBoardDto.setRetry(true);
        SearchResultDto searchResultDto = boardSearchService.getSearchResultDto(username, searchBoardDto);
        List<AddressDto> addressList = userAddressService.findMyAddresses(username);
        searchResultDto.setAddressList(addressList);
        return new ResponseEntity<>(searchResultDto, HttpStatus.OK);
    }

}
