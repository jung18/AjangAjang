package com.ajangajang.backend.user.model.service;

import com.ajangajang.backend.board.model.dto.BoardListDto;
import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.repository.BoardLikeRepository;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.board.model.service.BoardService;
import com.ajangajang.backend.board.model.service.FileService;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.user.model.dto.KidInputDto;
import com.ajangajang.backend.user.model.dto.KidListDto;
import com.ajangajang.backend.user.model.dto.UserInfoDto;
import com.ajangajang.backend.user.model.dto.UserInputDto;
import com.ajangajang.backend.user.model.entity.Kid;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.KidRepository;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
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
    private final KidRepository kidRepository;

    public void signUp(String username, UserInputDto userInputDto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        user.setNickname(userInputDto.getNickname());
        user.setPhone(userInputDto.getPhone());
        user.setRole("ROLE_USER");
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
        return new UserInfoDto(user.getNickname(), user.getProfileImg(), user.getMainAddress().getId());
    }

    public List<BoardListDto> findMyLikes(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        List<Board> boards = boardLikeRepository.findMyLikes(user.getId());
        return boardService.getBoardListDtos(boards);
    }

    public List<BoardListDto> findMyBoards(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        return boardRepository.findAllByUserId(user.getId()).stream()
                .map(board -> new BoardListDto(board.getId(), board.getTitle(), board.getPrice(),
                        board.getCategory().getCategoryName(), board.getStatus(),
                        board.getLikedUsers().size(), board.getViewCount()))
                .collect(Collectors.toList());
    }

    public UserInfoDto findUserInfo(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        return new UserInfoDto(user.getNickname(), user.getProfileImg());
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

    public void addKid(String username, KidInputDto kidInputDto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        LocalDate birthDate = LocalDate.of(kidInputDto.getYear(), kidInputDto.getMonth(), kidInputDto.getDay());
        Kid kid = new Kid(kidInputDto.getName(), birthDate, kidInputDto.getGender(), user);
        kidRepository.save(kid);
    }

    public void deleteKid(String username, Long kidId) {
        Kid kid = kidRepository.findById(kidId).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.KID_NOT_FOUND));

        // 본인의 아이가 아닌 경우 삭제 불가
        if (!username.equals(kid.getUser().getUsername())) {
            throw new CustomGlobalException(CustomStatusCode.PERMISSION_DENIED);
        }

        kidRepository.delete(kid);
    }

    public List<KidListDto> findMyKids(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        List<Kid> kids = user.getKids();
        return kids.stream()
                .map(kid -> new KidListDto(kid.getId(), kid.getName(), kid.getBirthDate(), kid.getGender()))
                .collect(Collectors.toList());
    }

}
