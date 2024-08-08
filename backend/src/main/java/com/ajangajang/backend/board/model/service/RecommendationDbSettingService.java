package com.ajangajang.backend.board.model.service;

import com.ajangajang.backend.board.model.entity.AgeGroup;
import com.ajangajang.backend.board.model.entity.Category;
import com.ajangajang.backend.board.model.entity.Gender;
import com.ajangajang.backend.board.model.entity.Recommendation;
import com.ajangajang.backend.board.model.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class RecommendationDbSettingService {

    private RecommendationRepository recommendationRepository;

    public void databaseSetting() {
        for (AgeGroup ageGroup : AgeGroup.values()) {
            for (Gender gender : Gender.values()) {
                for (Category category : Category.values()) {
                    if (category != Category.ETC) {
                        recommendationRepository.save(new Recommendation(ageGroup, gender, category));
                    }
                }
            }
        }
    }

}
