package com.ajangajang.backend.user.model.service;

import com.ajangajang.backend.board.model.dto.BoardListDto;
import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.entity.Gender;
import com.ajangajang.backend.board.model.repository.BoardLikeRepository;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.board.model.service.BoardService;
import com.ajangajang.backend.board.model.service.FileService;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.user.model.dto.*;
import com.ajangajang.backend.user.model.entity.Child;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.ChildRepository;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final BoardRepository boardRepository;

    private final FileService fileService;
    private final BoardService boardService;
    private final ChildRepository childRepository;
    private final LevelService levelService;

    public void signUp(String username, UserInputDto userInputDto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        user.setNickname(userInputDto.getNickname());
        user.setPhone(userInputDto.getPhone());
        user.setRole("ROLE_USER");
        user.setScore(30);
        userRepository.save(user);
    }

    public String saveProfileImage(MultipartFile profile, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        String profileUrl = fileService.uploadProfileImage(profile);
        user.setProfileImg(profileUrl);
        return profileUrl;
    }

    public void updateProfileImage(MultipartFile profile, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        fileService.delete(user.getProfileImg());
        String profileUrl = fileService.uploadProfileImage(profile);
        user.setProfileImg(profileUrl);
    }

    public void deleteProfileImage(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        fileService.delete(user.getProfileImg());
        user.setProfileImg(null);
    }

    public UserInfoDto findMyInfo(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        return new UserInfoDto(user.getId(), user.getNickname(), user.getProfileImg(), user.getMainAddress().getId(),
                user.getMainAddress().getFullAddress(), user.getMainAddress().getLongitude(),
                user.getMainAddress().getLatitude(), levelService.getLevel(user.getScore()), user.getScore());
    }

    public List<BoardListDto> findMyLikes(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        List<Board> boards = boardLikeRepository.findMyLikes(user.getId());
        return boardService.getBoardListDtos(boards);
    }

    public List<BoardListDto> findMyBoards(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        List<Board> boardList = boardRepository.findAllByUserId(user.getId());
        return boardService.getBoardListDtos(boardList);
    }

    public UserInfoDto findUserInfo(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        return new UserInfoDto(user.getId(), user.getNickname(), user.getProfileImg(), user.getMainAddress().getId(), user.getMainAddress().getFullAddress(),
                user.getMainAddress().getLongitude(), user.getMainAddress().getLatitude(), levelService.getLevel(user.getScore()), user.getScore());
    }

    public void updateMyInfo(String username, UserInputDto userInputDto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        user.setNickname(userInputDto.getNickname());
        user.setPhone(userInputDto.getPhone());
        userRepository.save(user);
    }

    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        userRepository.delete(user);
    }

    public boolean isPhoneRegistered(String phone) {
        return userRepository.findByPhone(phone).isPresent();
    }

    public void addChild(String username, ChildInputDto childInputDto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        LocalDate birthDate = LocalDate.of(childInputDto.getYear(), childInputDto.getMonth(), childInputDto.getDay());
        if (birthDate.isAfter(LocalDate.now(ZoneId.of("Asia/Seoul")))) {
            throw new CustomGlobalException(CustomStatusCode.INVALID_BIRTHDATE);
        }
        Child child = new Child(childInputDto.getName(), birthDate, Gender.valueOf(childInputDto.getGender()), user);
        Child savedChild = childRepository.save(child);
        if (user.getMainChildId() == null) {
            user.setMainChildId(savedChild.getId());
        }
    }

    public void deleteChild(String username, Long childId) {
        Child child = childRepository.findById(childId).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.CHILD_NOT_FOUND));

        // 본인의 아이가 아닌 경우 삭제 불가
        if (!username.equals(child.getUser().getUsername())) {
            throw new CustomGlobalException(CustomStatusCode.PERMISSION_DENIED);
        }

        // 대표 아이인 경우 삭제 불가
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        if (user.getMainChildId().equals(childId)) {
            throw new CustomGlobalException(CustomStatusCode.MAIN_CHILD_DELETE_FAIL);
        }

        childRepository.delete(child);
    }

    public List<ChildListDto> findMyChildren(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        List<Child> children = user.getChildren();
        return children.stream()
                .map(child -> new ChildListDto(child.getId(), child.getName(), child.getBirthDate(), child.getGender().name(),
                                                child.getId().equals(user.getMainChildId())))
                .collect(Collectors.toList());
    }

    public void changeMainChild(String username, Long childId) {
        Child child = childRepository.findById(childId).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.CHILD_NOT_FOUND));

        // 본인의 아이가 아닌 경우 변경 불가
        if (!username.equals(child.getUser().getUsername())) {
            throw new CustomGlobalException(CustomStatusCode.PERMISSION_DENIED);
        }

        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        user.setMainChildId(childId);
    }

}
