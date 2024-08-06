package com.ajangajang.backend.elasticsearch.model.service;

import com.ajangajang.backend.elasticsearch.model.document.AddressDocument;
import com.ajangajang.backend.elasticsearch.model.repository.AddressSearchRepository;
import com.ajangajang.backend.elasticsearch.model.repository.BoardSearchRepository;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import lombok.RequiredArgsConstructor;
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

}
