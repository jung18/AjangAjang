package com.ajangajang.backend.elasticsearch.model.service;

import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import com.ajangajang.backend.api.kakaomap.model.entity.NearType;
import com.ajangajang.backend.board.model.dto.BoardListDto;
import com.ajangajang.backend.board.model.dto.SearchBoardDto;
import com.ajangajang.backend.board.model.dto.SearchResultDto;
import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.board.model.service.BoardService;
import com.ajangajang.backend.elasticsearch.model.document.AddressDocument;
import com.ajangajang.backend.elasticsearch.model.document.BoardDocument;
import com.ajangajang.backend.elasticsearch.model.repository.AddressSearchRepository;
import com.ajangajang.backend.elasticsearch.model.repository.BoardSearchRepository;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.user.model.entity.Address;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.FetchSourceFilter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.ajangajang.backend.api.kakaomap.model.entity.NearType.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BoardSearchService {

    private final AddressSearchRepository addressSearchRepository;
    private final BoardSearchRepository boardSearchRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    private final NaverApiService naverApiService;
    private final BoardService boardService;
    private final ElasticsearchOperations elasticsearchOperations;

    // 지역 필터링만
    public Page<BoardListDto> getNearbyBoards(String username, SearchBoardDto searchBoardDto) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Address mainAddress = findUser.getMainAddress();
        // 메인 주소 없으면 안됨
        if (mainAddress == null) {
            throw new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND);
        }

        List<String> codes = getNearbyCodes(mainAddress.getAddressCode(), mainAddress.getNearType());
        // 쿼리 생성
        BoolQuery.Builder boolQueryBuilder = defaultBoolQueryBuilder(codes);
        Query searchQuery = boolQueryBuilder.build()._toQuery();
        // 페이징
        Pageable pageable = PageRequest.of(searchBoardDto.getPage(), searchBoardDto.getSize());
        NativeQuery query = defaultNativeQueryBuilder(searchQuery, pageable);
        SearchHits<BoardDocument> response = elasticsearchOperations.search(query, BoardDocument.class);
        List<BoardListDto> searchResult = getSearchResult(response);

        return new PageImpl<>(searchResult, pageable, response.getTotalHits());
    }

    public List<String> getNearbyCodes(String addressCode, NearType nearType) {
        AddressDocument addressDocument = addressSearchRepository.findById(addressCode)
                .orElseThrow(() -> new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND));
        List<String> codes = new ArrayList<>();
        if (CLOSE.equals(nearType)) {
            codes.addAll(addressDocument.getCloseCodes());
        } else if (MEDIUM.equals(nearType)) {
            codes.addAll(addressDocument.getCloseCodes());
            codes.addAll(addressDocument.getMediumCodes());
        } else if (FAR.equals(nearType)) {
            codes.addAll(addressDocument.getCloseCodes());
            codes.addAll(addressDocument.getMediumCodes());
            codes.addAll(addressDocument.getFarCodes());
        } else {
            throw new CustomGlobalException(CustomStatusCode.NEARTYPE_NOT_FOUND);
        }
        codes.add(addressCode); // 현재 지역도 포함
        return codes;
    }

    public void save(Board board) {
        boardSearchRepository.save(BoardDocument.from(board));
    }

    public void delete(Long id) {
        boardSearchRepository.deleteById(id);
    }

    public SearchResultDto getSearchResultDto(String username, SearchBoardDto searchBoardDto) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Address mainAddress = findUser.getMainAddress();
        // 메인주소 없으면 안됨
        if (mainAddress == null) {
            throw new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND);
        }

        SearchResultDto searchResultDto = new SearchResultDto();

        if (!searchBoardDto.isRetry()) {
            String query = searchBoardDto.getTitle();
            String suggestion = naverApiService.checkQuery(query);
            if (!suggestion.isEmpty()) {
                searchBoardDto.setTitle(suggestion);
                searchResultDto.setOriginalTitle(query);
                searchResultDto.setSuggestedTitle(suggestion);
                searchResultDto.setChanged(true);
            }
        }

        Page<BoardListDto> searchResult = search(mainAddress.getAddressCode(), mainAddress.getNearType(), searchBoardDto);
        searchResultDto.setSearchResult(searchResult);

        return searchResultDto;
    }

    public Page<BoardListDto> search(String addressCode, NearType nearType, SearchBoardDto searchBoardDto) {
        String title = searchBoardDto.getTitle();
        String category = searchBoardDto.getCategory();
        int page = searchBoardDto.getPage();
        int size = searchBoardDto.getSize();

        List<String> codes = getNearbyCodes(addressCode, nearType);

        // 기본 bool 쿼리 빌더
        BoolQuery.Builder boolQueryBuilder = defaultBoolQueryBuilder(codes);

        // title이 존재하는 경우 match 쿼리 추가
        if (title != null && !title.isEmpty()) {
            boolQueryBuilder.must(QueryBuilders.match(m -> m.field("title")
                    .query(title).operator(co.elastic.clients.elasticsearch._types.query_dsl.Operator.And)));
        }

        // category가 존재하는 경우 term 쿼리 추가
        if (category != null && !category.isEmpty()) {
            boolQueryBuilder.must(QueryBuilders.term(t -> t.field("category").value(category)));
        }

        // 쿼리 생성
        Query searchQuery = boolQueryBuilder.build()._toQuery();
        Pageable pageable = PageRequest.of(page, size);
        NativeQuery query = defaultNativeQueryBuilder(searchQuery, pageable);

        // 검색
        SearchHits<BoardDocument> response = elasticsearchOperations.search(query, BoardDocument.class);
        List<BoardListDto> boardListDtos = getSearchResult(response);
        return new PageImpl<>(boardListDtos, pageable, response.getTotalHits());
    }

    private BoolQuery.Builder defaultBoolQueryBuilder(List<String> codes) {
        return QueryBuilders.bool()
                .filter(QueryBuilders.terms(t -> t.field("addressCode")
                        .terms(v -> v.value(codes.stream()
                                .map(FieldValue::of).collect(Collectors.toList())))))
                .filter(QueryBuilders.terms(t -> t.field("status")
                        .terms(v -> v.value(Stream.of("FOR_SALE", "RESERVED")
                                .map(FieldValue::of).collect(Collectors.toList())))));
    }

    private NativeQuery defaultNativeQueryBuilder(Query searchQuery, Pageable pageable) {
        return NativeQuery.builder()
                .withQuery(searchQuery)
                .withPageable(pageable)
                .withSourceFilter(new FetchSourceFilter(new String[]{"boardId"}, null))
                .build();
    }

    private List<BoardListDto> getSearchResult(SearchHits<BoardDocument> response) {
        List<Long> boardIds = response.getSearchHits().stream()
                .map(hit -> hit.getContent().getBoardId()).toList();
        List<Board> boards = boardRepository.findByIdIn(boardIds);
        return boardService.getBoardListDtos(boards);
    }

}