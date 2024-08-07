package com.ajangajang.backend.api.kakaomap.model.service;

import com.ajangajang.backend.api.kakaomap.model.entity.Regions;
import com.ajangajang.backend.api.kakaomap.model.repository.RegionsRepository;
import com.ajangajang.backend.board.model.dto.CreateBoardDto;
import com.ajangajang.backend.board.model.entity.Board;
import com.ajangajang.backend.board.model.entity.Category;
import com.ajangajang.backend.board.model.entity.Status;
import com.ajangajang.backend.board.model.repository.BoardRepository;
import com.ajangajang.backend.elasticsearch.model.service.BoardSearchService;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.user.model.entity.Address;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.repository.AddressRepository;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Slf4j
@Service
@RequiredArgsConstructor
public class TestDataService {

    private final BoardSearchService boardSearchService;
    private final UserRepository userRepository;
    private final RegionsRepository regionsRepository;
    private final BoardRepository boardRepository;
    private final AddressRepository addressRepository;

    @Transactional
    public void testDataInit(String username) {
        User writer = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        try {
            // Load the JSON file from the resources/static directory
            ClassPathResource resource = new ClassPathResource("static/board_request.json");

            // Read the file content into a String
            String jsonContent = new String(Files.readAllBytes(Paths.get(resource.getURI())));

            // Convert the String to a JSONArray
            JSONArray jsonArray = new JSONArray(jsonContent);

            // Iterate through the JSONArray and print each JSONObject
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                Board saveTestEntity = saveTestEntity(writer, jsonObject);
                saveTestDoc(saveTestEntity);
            }
        } catch (IOException e) {
            log.error(e.getMessage());
        }
    }

    @Transactional
    public Board saveTestEntity(User writer, JSONObject jsonObject) {
        String title = jsonObject.getString("title");
        int price = jsonObject.getInt("price");
        String content = jsonObject.getString("content");
        String category = jsonObject.getString("category");
        Status status = Status.fromString(jsonObject.getString("status"));
        Long addressId = jsonObject.getLong("addressId");
        CreateBoardDto dto = new CreateBoardDto(title, price, content, category, status, addressId);
        Regions findRegion = regionsRepository.findById(addressId).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND));

        Board board = new Board(dto.getTitle(), dto.getPrice(), dto.getContent(), dto.getStatus(), Category.valueOf(dto.getCategory()));

        Address testAddress = new Address(findRegion.getSido(), findRegion.getSigg(), findRegion.getEmd(),
                                "full address", findRegion.getLongitude(), findRegion.getLatitude(),
                                        findRegion.getAddressCode());
        Address savedAddress = addressRepository.save(testAddress);

        board.setAddress(savedAddress);
        writer.addMyBoard(board);
        return boardRepository.save(board);
    }

    @Transactional
    public void saveTestDoc(Board board) {
        boardSearchService.save(board);
    }

}
