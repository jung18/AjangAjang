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

@Service
@RequiredArgsConstructor
public class BoardLikeService {

    private final BoardRepository boardRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final UserRepository userRepository;

    public void likeBoard(String username, Long id) {
        User findUser = userRepository.findByUsername(username);
        if (findUser == null) {
            throw new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND);
        }
        Board findBoard = boardRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));

        if (boardLikeRepository.existsByBoardIdAndUserName(id, username)) {
            throw new CustomGlobalException(CustomStatusCode.ALREADY_LIKED);
        }

        BoardLike boardLike = new BoardLike();
        boardLike.setBoard(findBoard);
        boardLike.setUser(findUser);
        boardLikeRepository.save(boardLike);
    }

    public void unlikeBoard(String username, Long id) {
        User findUser = userRepository.findByUsername(username);
        if (findUser == null) {
            throw new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND);
        }
        Board findBoard = boardRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        BoardLike findLike = boardLikeRepository.findByBoardIdAndUserName(id, username);
        if (findLike == null) {
            throw new CustomGlobalException(CustomStatusCode.LIKE_NOT_FOUND);
        }
        boardLikeRepository.delete(findLike);
    }

}
