package com.ajangajang.backend.elasticsearch.model.service;

import com.ajangajang.backend.board.model.dto.SearchBoardDto;
import com.ajangajang.backend.board.model.dto.SearchResultDto;
import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.elasticsearch.model.document.AddressDocument;
import com.ajangajang.backend.elasticsearch.model.document.BoardDocument;
import com.ajangajang.backend.elasticsearch.model.repository.AddressSearchRepository;
import com.ajangajang.backend.elasticsearch.model.repository.BoardSearchRepository;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardSearchService {

    private final AddressSearchRepository addressSearchRepository;
    private final BoardSearchRepository boardSearchRepository;
    private final ElasticsearchOperations elasticsearchOperations;
    private final BoardRepository boardRepository;
    private NaverApiService naverApiService;

    // 지역 필터링만
    public List<Long> getNearbyBoardIds(String addressCode, String nearType) {
        List<String> codes = getNearbyCodes(addressCode, nearType);
        return boardSearchRepository.findByAddressCodeIn(codes).stream()
                .map(BoardDocument::getBoardId).collect(Collectors.toList());
    }

    public List<String> getNearbyCodes(String addressCode, String nearType) {
        AddressDocument addressDocument = addressSearchRepository.findById(addressCode)
                .orElseThrow(() -> new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND));
        List<String> codes = new ArrayList<>();
        if ("CLOSE".equals(nearType)) {
            codes.addAll(addressDocument.getCloseCodes());
        } else if ("MEDIUM".equals(nearType)) {
            codes.addAll(addressDocument.getCloseCodes());
            codes.addAll(addressDocument.getMediumCodes());
        } else if ("FAR".equals(nearType)) {
            codes.addAll(addressDocument.getCloseCodes());
            codes.addAll(addressDocument.getMediumCodes());
            codes.addAll(addressDocument.getFarCodes());
        } else {
            throw new CustomGlobalException(CustomStatusCode.NEARTYPE_NOT_FOUND);
        }
        return codes;
    }

    public void save(Board board) {
        boardSearchRepository.save(BoardDocument.from(board));
    }

    public void delete(Long id) {
        boardSearchRepository.deleteById(id);
    }

    public SearchResultDto getSearchResultDto(SearchBoardDto searchBoardDto) {

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

        Page<Board> searchResult = search(searchBoardDto);
        searchResultDto.setSearchResult(searchResult);

        return searchResultDto;
    }

    public Page<Board> search(SearchBoardDto searchBoardDto) {
        String title = searchBoardDto.getTitle();
        String category = searchBoardDto.getCategory();
        String addressCode = searchBoardDto.getAddressCode();
        int page = searchBoardDto.getPage();
        int size = searchBoardDto.getSize();

        Pageable pageable = PageRequest.of(page, size);
        Page<BoardDocument> boardDocuments = boardSearchRepository.findByTitleAndCategoryAndAddressCode(title, category, addressCode, pageable);
        List<Long> boardIds = boardDocuments.stream()
                .map(BoardDocument::getBoardId)
                .collect(Collectors.toList());
        List<Board> boards = boardRepository.findAllById(boardIds);
        return new PageImpl<>(boards, pageable, boardDocuments.getTotalElements());
    }

}