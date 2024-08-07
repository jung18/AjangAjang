package com.ajangajang.backend.elasticsearch.model.repository;

import com.ajangajang.backend.elasticsearch.model.document.AddressDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface AddressSearchRepository extends ElasticsearchRepository<AddressDocument, String> {
}
