package com.ajangajang.backend.board.model.service;

import com.ajangajang.backend.board.model.dto.*;
import com.ajangajang.backend.board.model.entity.*;
import com.ajangajang.backend.board.model.repository.*;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.user.model.dto.UserProfileDto;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardMediaRepository boardMediaRepository;
    private final CategoryRepository categoryRepository;
    private final DeliveryTypeRepository deliveryTypeRepository;
    private final UserRepository userRepository;

    private final FileService fileService;

    public Long save(String username, CreateBoardDto dto, List<MultipartFile> files) {
        User writer = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Board board = new Board(dto.getTitle(), dto.getPrice(), dto.getContent(), dto.getStatus());
        Category savedCategory = categoryRepository.save(new Category(dto.getCategory()));
        DeliveryType savedDeliveryType = deliveryTypeRepository.save(new DeliveryType(dto.getDeliveryType()));

        board.setCategory(savedCategory);
        board.setDeliveryType(savedDeliveryType);
        setBoardMedia(files, board); // file upload, media save
        writer.addMyBoard(board);

        return boardRepository.save(board).getId();
    }

    public BoardDto findById(Long id) {
        Board findBoard = boardRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));

        List<BoardMediaDto> mediaDtoList = findBoard.getMediaList().stream()
                .map(media -> new BoardMediaDto(media.getId(), media.getMediaType(), media.getMediaUrl(),
                        media.getCreatedAt()))
                .collect(Collectors.toList());

        User findWriter = findBoard.getWriter();
        UserProfileDto userProfileDto = new UserProfileDto(findWriter.getId(), findWriter.getNickname(), findWriter.getProfileImg());

        return new BoardDto(userProfileDto, findBoard.getTitle(), findBoard.getPrice(),
                            findBoard.getContent(), findBoard.getDeliveryType().getType(),
                            findBoard.getCategory().getCategoryName(), findBoard.getStatus(),
                            mediaDtoList, findBoard.getLikedUsers().size(), findBoard.getCreatedAt(), findBoard.getUpdatedAt());
    }

    public List<BoardListDto> findAll() {
        List<Board> boards = boardRepository.findAllWithWriter();
        return getBoardListDtos(boards);
    }

    public void update(Long id, String username, UpdateBoardDto updateParam, List<MultipartFile> files) {
        if (updateParam == null && files == null) {
            throw new CustomGlobalException(CustomStatusCode.EMPTY_UPDATE_DATA);
        }
        // 엔티티 조회
        Board findBoard = boardRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        Category findCategory = categoryRepository.findById(findBoard.getCategory().getId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.CATEGORY_NOT_FOUND));
        DeliveryType findDeliveryType = deliveryTypeRepository.findById(findBoard.getDeliveryType().getId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.DELIVERY_NOT_FOUND));
        // 본인의 게시글이 아닌 경우 수정 불가
        if (!username.equals(findBoard.getWriter().getUsername())) {
            throw new CustomGlobalException(CustomStatusCode.PERMISSION_DENIED);
        }
        // 내용 업데이트
        if (updateParam != null) {
            findCategory.setCategoryName(updateParam.getCategory());
            findDeliveryType.setType(updateParam.getDeliveryType());

            findBoard.setTitle(updateParam.getTitle());
            findBoard.setPrice(updateParam.getPrice());
            findBoard.setContent(updateParam.getContent());
            findBoard.setCategory(findCategory);
            findBoard.setStatus(updateParam.getStatus());
            findBoard.setDeliveryType(findDeliveryType);
            // 파일 삭제
            deleteFiles(updateParam.getDeleteFileIds());
        }
        // 새 파일 추가
        setBoardMedia(files, findBoard);
    }

    public void delete(Long id, String username) {
        Board findBoard = boardRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        // 본인의 게시글이 아닌 경우 삭제 불가
        if (!username.equals(findBoard.getWriter().getUsername())) {
            throw new CustomGlobalException(CustomStatusCode.PERMISSION_DENIED);
        }
        List<String> fileUrls = findBoard.getMediaList().stream().map(BoardMedia::getMediaUrl).collect(Collectors.toList());
        fileService.deleteFiles(fileUrls);
        boardRepository.deleteById(id);
    }

    public List<BoardListDto> searchByQuery(String query) {
        List<Board> boards = boardRepository.findAllByQuery(query);
        return getBoardListDtos(boards);
    }

    public List<BoardListDto> filterByTag(String tag) {
        List<Board> boards = boardRepository.findAllByTag(tag);
        return getBoardListDtos(boards);
    }

    public List<BoardListDto> findAllByUserId(Long userId) {
        return boardRepository.findAllByUserId(userId).stream()
                .map(board -> new BoardListDto(board.getId(), board.getTitle(), board.getPrice(),
                        board.getDeliveryType().getType(), board.getCategory().getCategoryName(),
                        board.getStatus(), board.getLikedUsers().size()))
                .collect(Collectors.toList());
    }

    private void setBoardMedia(List<MultipartFile> files, Board board) {
        if (files != null && !files.isEmpty()) {
            // Url + fileName, mediaType
            Map<String, MediaType> filesInfo = fileService.uploadFiles(files);
            for (Map.Entry<String, MediaType> entry : filesInfo.entrySet()) {
                BoardMedia media = new BoardMedia(entry.getValue(), entry.getKey());
                board.addMedia(media);
                boardMediaRepository.save(media);
            }
        }
    }

    private void deleteFiles(List<Long> deleteFileIds) {
        if (!deleteFileIds.isEmpty()) {
            for (Long deleteFileId : deleteFileIds) {
                String deleteFileUrl = boardMediaRepository.findById(deleteFileId)
                        .orElseThrow(() -> new CustomGlobalException(CustomStatusCode.MEDIA_NOT_FOUND))
                        .getMediaUrl();
                fileService.delete(deleteFileUrl);
                boardMediaRepository.deleteById(deleteFileId);
            }
        }
    }

    public List<BoardListDto> getBoardListDtos(List<Board> boards) {
        List<BoardListDto> result = new ArrayList<>();
        for (Board board : boards) {
            User writer = board.getWriter();
            UserProfileDto profile = new UserProfileDto(writer.getId(), writer.getNickname(),
                    writer.getProfileImg());
            result.add(new BoardListDto(board.getId(), profile, board.getTitle(), board.getPrice(),
                    board.getDeliveryType().getType(), board.getCategory().getCategoryName(),
                    board.getStatus(), board.getLikedUsers().size()));
        }
        return result;
    }

}
