package com.ajangajang.backend.board.model.service;

import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.entity.BoardLike;
import com.ajangajang.backend.board.model.repository.BoardLikeRepository;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardLikeService {

    private final BoardRepository boardRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final UserRepository userRepository;

    public void likeBoard(String username, Long id) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Board findBoard = boardRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        // 본인의 게시글은 찜 불가
        if (findUser.getId().equals(findBoard.getWriter().getId())) {
            throw new CustomGlobalException(CustomStatusCode.SELF_LIKE_NOT_ALLOWED);
        }
        // 중복 찜 불가
        if (boardLikeRepository.existsByBoardIdAndUserId(id, findUser.getId())) {
            throw new CustomGlobalException(CustomStatusCode.ALREADY_LIKED);
        }

        BoardLike boardLike = new BoardLike();
        findUser.addMyLike(boardLike);
        findBoard.addLikedUser(boardLike);
        boardLikeRepository.save(boardLike);
    }

    public void unlikeBoard(String username, Long id) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Board findBoard = boardRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        BoardLike findLike = boardLikeRepository.findByBoardIdAndUserId(id, findUser.getId());
        if (findLike == null) {
            throw new CustomGlobalException(CustomStatusCode.LIKE_NOT_FOUND);
        }
        boardLikeRepository.delete(findLike);
    }

}
