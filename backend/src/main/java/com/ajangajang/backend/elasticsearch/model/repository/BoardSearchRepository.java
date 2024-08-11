package com.ajangajang.backend.elasticsearch.model.repository;

import com.ajangajang.backend.elasticsearch.model.document.BoardDocument;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


public interface BoardSearchRepository extends ElasticsearchRepository<BoardDocument, Long> {

    void deleteById(@NotNull Long id);
}
