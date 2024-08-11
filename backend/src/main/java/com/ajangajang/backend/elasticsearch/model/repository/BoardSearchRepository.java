package com.ajangajang.backend.elasticsearch.model.repository;

import com.ajangajang.backend.elasticsearch.model.document.BoardDocument;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface BoardSearchRepository extends ElasticsearchRepository<BoardDocument, Long> {

    Page<BoardDocument> findByAddressCodeInAndStatusIn(List<String> addressCodes, List<String> statuses, Pageable pageable);

    void deleteById(@NotNull Long id);
}
