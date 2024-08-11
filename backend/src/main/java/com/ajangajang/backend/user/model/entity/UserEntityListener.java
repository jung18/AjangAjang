package com.ajangajang.backend.user.model.entity;

import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.elasticsearch.model.repository.BoardSearchRepository;
import jakarta.persistence.PreRemove;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import java.util.List;

public class UserEntityListener implements ApplicationContextAware {

    private static ApplicationContext context;

    @Override
    public void setApplicationContext(@NotNull ApplicationContext applicationContext) {
        context = applicationContext;
    }

    @PreRemove
    public void preRemove(User user) {
        BoardSearchRepository boardSearchRepository = context.getBean(BoardSearchRepository.class);
        List<Board> boards = user.getMyBoards();
        for (Board board : boards) {
            boardSearchRepository.deleteById(board.getId());
        }
    }

}
