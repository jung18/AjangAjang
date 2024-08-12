package com.ajangajang.backend.review.controller;

import com.ajangajang.backend.oauth.model.dto.CustomOAuth2User;
import com.ajangajang.backend.review.model.dto.CreateReviewDto;
import com.ajangajang.backend.review.model.dto.ReviewDto;
import com.ajangajang.backend.review.model.dto.UpdateReviewDto;
import com.ajangajang.backend.review.model.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> saveReview(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                        @RequestBody CreateReviewDto createReviewDto) {
        String username = customOAuth2User.getUsername();
        Long reviewId = reviewService.save(username, createReviewDto);
        return ResponseEntity.ok(Map.of("reviewId", reviewId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findReview(@PathVariable("id") Long id) {
        ReviewDto result = reviewService.findById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<?> findMyReviews(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        List<ReviewDto> result = reviewService.findMyReviews(username);
        return ResponseEntity.ok(Map.of("data", result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable("id") Long id,
                                          @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                          @RequestBody UpdateReviewDto updateParam) {
        String username = customOAuth2User.getUsername();
        reviewService.update(id, username, updateParam);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable("id") Long id,
                                          @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        String username = customOAuth2User.getUsername();
        reviewService.delete(id, username);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
