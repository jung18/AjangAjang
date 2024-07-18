package com.ajangajang.backend.board.controller;

import com.ajangajang.backend.board.model.dto.BoardDto;
import com.ajangajang.backend.board.model.dto.BoardListDto;
import com.ajangajang.backend.board.model.dto.CreateBoardDto;
import com.ajangajang.backend.board.model.dto.UpdateBoardDto;
import com.ajangajang.backend.board.model.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BoardApiController {

    private final BoardService boardService;

    @PostMapping("/board")
    public ResponseEntity<?> saveBoard(
                            @RequestPart("board") CreateBoardDto createBoardDto,
                            @RequestPart(value = "media", required = false) List<MultipartFile> files) {
        Long boardId = boardService.save(createBoardDto, files);
        return ResponseEntity.ok(Map.of("boardId", boardId));
    }

    @GetMapping("/board/{id}")
    public ResponseEntity<?> getBoard(@PathVariable("id") Long id) {
        BoardDto result = boardService.findById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/board/all")
    public ResponseEntity<?> getAllBoards() {
        List<BoardListDto> result = boardService.findAll();
        return ResponseEntity.ok(Map.of("data", result));
    }

    @PutMapping("/board/{id}")
    public ResponseEntity<?> updateBoard(@PathVariable("id") Long id,
                            @RequestPart(value = "board", required = false) UpdateBoardDto updateParam,
                            @RequestPart(value = "media", required = false) List<MultipartFile> files) {
        boardService.update(id, updateParam, files);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/board/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable("id") Long id) {
        boardService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
