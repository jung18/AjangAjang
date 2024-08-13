package com.ajangajang.backend.board.model.service;

import com.ajangajang.backend.api.kakaomap.model.service.KakaoApiService;
import com.ajangajang.backend.board.model.dto.*;
import com.ajangajang.backend.board.model.entity.*;
import com.ajangajang.backend.board.model.repository.*;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.user.model.dto.UserProfileDto;
import com.ajangajang.backend.user.model.entity.Address;
import com.ajangajang.backend.user.model.entity.Child;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.AddressRepository;
import com.ajangajang.backend.user.model.repository.ChildRepository;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
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
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    private final FileService fileService;
    private final KakaoApiService kakaoApiService;
    private final ChildRepository childRepository;
    private final RecommendationRepository recommendationRepository;

    public Board save(String username, CreateBoardDto dto, List<MultipartFile> files) {
        User writer = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Board board = new Board(dto.getTitle(), dto.getPrice(), dto.getContent(), dto.getStatus(), Category.valueOf(dto.getCategory()));
        Address address = addressRepository.findById(dto.getAddressId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND));

        board.setAddress(address);
        setBoardMedia(files, board); // file upload, media save
        writer.addMyBoard(board);

        return boardRepository.save(board);
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
                            findBoard.getContent(), findBoard.getCategory().name(), findBoard.getStatus(),
                            mediaDtoList, findBoard.getLikedUsers().size(), findBoard.getViewCount(),
                            findBoard.getCreatedAt(), findBoard.getUpdatedAt());
    }

    public List<BoardListDto> findAllInRange(String username, String type) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        List<String> nearbyAddressCodes = kakaoApiService.getNearbyAddressCodes(findUser.getMainAddress().getAddressCode(), type);
        List<Board> boards = boardRepository.findAllInRange(nearbyAddressCodes);
        return getBoardListDtos(boards);
    }

    public void update(Long id, String username, UpdateBoardDto updateParam, List<MultipartFile> files) {
        if (updateParam == null && files == null) {
            throw new CustomGlobalException(CustomStatusCode.EMPTY_UPDATE_DATA);
        }
        // 엔티티 조회
        Board findBoard = boardRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        // 본인의 게시글이 아닌 경우 수정 불가
        if (!username.equals(findBoard.getWriter().getUsername())) {
            throw new CustomGlobalException(CustomStatusCode.PERMISSION_DENIED);
        }
        // 내용 업데이트
        if (updateParam != null) {
            findBoard.setTitle(updateParam.getTitle());
            findBoard.setPrice(updateParam.getPrice());
            findBoard.setContent(updateParam.getContent());
            findBoard.setCategory(Category.valueOf(updateParam.getCategory()));
            findBoard.setStatus(updateParam.getStatus());

            Address findAddress = addressRepository.findById(updateParam.getAddressId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND));
            findBoard.setAddress(findAddress);

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

    public List<BoardListDto> findAllByUserId(Long userId) {
        List<Board> boards = boardRepository.findAllByUserId(userId);
        return getBoardListDtos(boards);
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
//        else {
//            throw new CustomGlobalException(CustomStatusCode.AT_LEAST_ONE_MEDIA_REQUIRED);
//        }
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
            String thumbnail = getThumbnail(board);
            UserProfileDto profile = new UserProfileDto(writer.getId(), writer.getNickname(),
                    writer.getProfileImg());
            result.add(new BoardListDto(board.getId(), thumbnail, profile, board.getTitle(), board.getPrice(),
                    board.getCategory().name(),
                    board.getStatus(), board.getLikedUsers().size(), board.getViewCount()));
        }
        return result;
    }

    public @NotNull String getThumbnail(Board board) {
        String thumbnail = "";
        List<BoardMedia> mediaList = board.getMediaList();
        // 판매글 썸네일 불러오기
        for (BoardMedia media : mediaList) {
            if (media.getMediaType() == MediaType.IMAGE) {
                thumbnail = media.getMediaUrl();
                break;
            }
        }
//        if (thumbnail == null || thumbnail.isEmpty()) {
//            throw new CustomGlobalException(CustomStatusCode.AT_LEAST_ONE_MEDIA_REQUIRED);
//        }
        return thumbnail;
    }

    public Board findBoardById(Long boardId) {
        return boardRepository.findById(boardId).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
    }

    public void increaseViewCount(Long boardId) {
        boardRepository.increaseViewCount(boardId);
    }

    public void increaseRecommendationViewCount(String username, Long boardId) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Long childId = user.getMainChildId();
        Child child = childRepository.findById(childId).orElse(null);

        // 대표 자녀가 없으면 작동 안함
        if (child == null) {
            return;
        }

        Board board = boardRepository.findById(boardId).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.BOARD_NOT_FOUND));
        String category = board.getCategory().name();

        // 카테고리가 없거나 '기타'면 카운트 안함
        if (category == null || category.equals("ETC")) {
            return;
        }

        String ageGroup = searchAgeGroup(child.getBirthDate()).name();
        String gender = child.getGender().name();

        recommendationRepository.increaseRecommendationViewCount(ageGroup, gender, category);
    }

    public AgeGroup searchAgeGroup(LocalDate birthDate) {
        LocalDate nowDate = LocalDate.now(ZoneId.of("Asia/Seoul"));

        long yearsBetween = ChronoUnit.YEARS.between(birthDate, nowDate);
        if (yearsBetween < 1) {
            if (ChronoUnit.MONTHS.between(birthDate, nowDate) < 3) {
                return AgeGroup.UP_TO_THREE_MONTH;
            } else {
                return AgeGroup.FROM_THREE_MONTH_TO_ONE;
            }
        } else if (yearsBetween < 3) {
            return AgeGroup.FROM_ONE_TO_THREE;
        } else if (yearsBetween < 6) {
            return AgeGroup.FROM_THREE_TO_SIX;
        } else if (yearsBetween < 9) {
            return AgeGroup.FROM_SIX_TO_NINE;
        } else if (yearsBetween < 13) {
            return AgeGroup.FROM_NINE_TO_THIRTEEN;
        } else {
            return AgeGroup.FROM_THIRTEEN;
        }
    }

    public Category findRecommendationCategory(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Long mainChildId = user.getMainChildId();
        Child child = childRepository.findById(mainChildId).orElse(null);

        // 대표 자녀가 없는 경우
        if (child == null) {
            throw new CustomGlobalException(CustomStatusCode.MAIN_CHILD_NOT_FOUND);
        }

        String ageGroup = searchAgeGroup(child.getBirthDate()).name();
        String gender = child.getGender().name();

        return recommendationRepository.findRecommendationCategory(ageGroup, gender);
    }

}
