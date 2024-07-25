package com.ajangajang.backend.review.model.service;

import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.review.model.dto.CreateReviewDto;
import com.ajangajang.backend.review.model.dto.ReviewDto;
import com.ajangajang.backend.review.model.dto.UpdateReviewDto;
import com.ajangajang.backend.review.model.entity.Review;
import com.ajangajang.backend.review.model.repository.ReviewRepository;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;

    public Long save(String username, CreateReviewDto dto) {
        User writer = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Board board = boardRepository.findById(dto.getBoardId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        Review review = new Review(dto.getScore(), dto.getContent());
        review.setBoard(board);
        review.setWriter(writer);

        return reviewRepository.save(review).getId();
    }

    public ReviewDto findById(Long id) {
        Review findReview = reviewRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.REVIEW_NOT_FOUND));
        return new ReviewDto(findReview.getScore(), findReview.getContent(),
                             findReview.getCreatedAt(), findReview.getUpdatedAt());
    }

    public List<ReviewDto> findAll() {
        return reviewRepository.findAll().stream()
                .map(review -> new ReviewDto(review.getScore(), review.getContent(),
                                            review.getCreatedAt(), review.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    public void update(Long id, String username, UpdateReviewDto updateParam) {
        Review findReview = reviewRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.REVIEW_NOT_FOUND));
        // 본인의 리뷰가 아닌 경우 수정 불가
        if (!username.equals(findReview.getWriter().getUsername())) {
            throw new CustomGlobalException(CustomStatusCode.PERMISSION_DENIED);
        }
        findReview.setScore(updateParam.getScore());
        findReview.setContent(updateParam.getContent());
    }

    public void delete(Long id, String username) {
        Review findReview = reviewRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.REVIEW_NOT_FOUND));
        // 본인의 리뷰가 아닌 경우 삭제 불가
        if (!username.equals(findReview.getWriter().getUsername())) {
            throw new CustomGlobalException(CustomStatusCode.PERMISSION_DENIED);
        }
        reviewRepository.deleteById(id);
    }

}
