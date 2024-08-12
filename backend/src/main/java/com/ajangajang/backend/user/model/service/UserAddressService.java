package com.ajangajang.backend.user.model.service;

import com.ajangajang.backend.api.kakaomap.model.service.KakaoApiService;
import com.ajangajang.backend.exception.CustomGlobalException;
import com.ajangajang.backend.exception.CustomStatusCode;
import com.ajangajang.backend.trade.model.dto.CreateRecommendDto;
import com.ajangajang.backend.trade.model.dto.RecommendDto;
import com.ajangajang.backend.trade.model.dto.RecommendType;
import com.ajangajang.backend.user.model.dto.AddressDto;
import com.ajangajang.backend.user.model.dto.MainAddressDto;
import com.ajangajang.backend.user.model.dto.SearchRangeDto;
import com.ajangajang.backend.user.model.entity.Address;
import com.ajangajang.backend.user.model.entity.User;
import com.ajangajang.backend.user.model.entity.UserAddress;
import com.ajangajang.backend.user.model.repository.AddressRepository;
import com.ajangajang.backend.user.model.repository.UserAddressRepository;
import com.ajangajang.backend.user.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserAddressService {

    private final KakaoApiService kakaoApiService;

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final UserAddressRepository userAddressRepository;

    private static final double EARTH_RADIUS = 6371.01 * 1000;

    public AddressDto saveAddressInfo(String username, String addressName) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Address responseAddress = kakaoApiService.getAddressByAddressName(addressName);
        Address findAddress = addressRepository.findByAddressCode(responseAddress.getAddressCode());

        // 이미 있는 주소면 조회 / 없으면 저장후 반환
        Address address;
        if (findAddress == null) {
            address = addressRepository.save(responseAddress);
        } else {
            address = findAddress;
        }

        // 대표 주소가 없으면 첫번째 주소를 대표로 설정
        if (findUser.getMainAddress() == null) {
            findUser.setMainAddress(address);
        }

        if (userAddressRepository.findByUserIdAndAddressId(findUser.getId(), address.getId()) != null) {
            // 이미 추가한 주소면 중복 추가 불가
            throw new CustomGlobalException(CustomStatusCode.DUPLICATE_ADDRESS);
        }

        UserAddress userAddress = new UserAddress(findUser, address);
        userAddressRepository.save(userAddress);
        return new AddressDto(address.getId(), address.getSido(), address.getSigg(), address.getEmd(),
                                address.getFullAddress(), address.getNearType());
    }

    public AddressDto saveAddressInfo(String username, double longitude, double latitude) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Address responseAddress = kakaoApiService.getAddressByCoordinates(longitude, latitude);
        Address findAddress = addressRepository.findByAddressCode(responseAddress.getAddressCode());

        // 이미 있는 주소면 조회 / 없으면 저장후 반환
        Address address;
        if (findAddress == null) {
            address = addressRepository.save(responseAddress);
        } else {
            address = findAddress;
        }

        // 대표 주소가 없으면 첫번째 주소를 대표로 설정
        if (findUser.getMainAddress() == null) {
            findUser.setMainAddress(address);
        }

        if (userAddressRepository.findByUserIdAndAddressId(findUser.getId(), address.getId()) != null) {
            // 이미 추가한 주소면 중복 추가 불가
            throw new CustomGlobalException(CustomStatusCode.DUPLICATE_ADDRESS);
        }

        UserAddress userAddress = new UserAddress(findUser, address);
        userAddressRepository.save(userAddress);
        return new AddressDto(address.getId(), address.getSido(), address.getSigg(), address.getEmd(),
                                address.getFullAddress(), address.getNearType());
    }

    public List<AddressDto> findMyAddresses(String username) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        return addressRepository.findMyAddresses(findUser.getId()).stream()
                .map(address -> new AddressDto(address.getId(), address.getSido(), address.getSigg(),
                                            address.getEmd(), address.getFullAddress(), address.getNearType(),
                                            address.getId().equals(findUser.getMainAddress().getId())))
                .collect(Collectors.toList());
    }

    public void deleteAddress(String username, Long id) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        UserAddress findUserAddress = userAddressRepository.findByUserIdAndAddressId(findUser.getId(), id);
        if (findUserAddress == null) {
            throw new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND);
        }
        if (Objects.equals(findUser.getMainAddress().getId(), id)) { // 대표 주소는 삭제 불가
            throw new CustomGlobalException(CustomStatusCode.MAIN_ADDRESS_DELETE_FAIL);
        }
        List<UserAddress> userAddressList = userAddressRepository.findByUserId(findUser.getId());
        if (userAddressList.size() <= 1) { // 하나남은 주소는 삭제 불가
            throw new CustomGlobalException(CustomStatusCode.AT_LEAST_ONE_ADDRESS_REQUIRED);
        }

        userAddressRepository.delete(findUserAddress);
    }

    public Long saveMainAddress(String username, MainAddressDto dto) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Address findAddress = addressRepository.findById(dto.getMainAddressId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.ADDRESS_NOT_FOUND));
        findUser.setMainAddress(findAddress);
        return findUser.getMainAddress().getId();
    }

    public String updateNearType(String username, SearchRangeDto dto) {
        User findUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        Address mainAddress = findUser.getMainAddress();
        mainAddress.setNearType(dto.getNearType());
        return mainAddress.getNearType().toString();
    }

    public List<RecommendDto> getRecommendLocations(CreateRecommendDto dto) {
        User buyer = userRepository.findById(dto.getBuyerId()).orElseThrow(() -> new CustomGlobalException(CustomStatusCode.USER_NOT_FOUND));
        double buyerX = buyer.getMainAddress().getLongitude();
        double buyerY = buyer.getMainAddress().getLatitude();
        int range = calculateRange(buyerX, buyerY, dto.getLongitude(), dto.getLatitude());
        List<RecommendDto> result;

        if (dto.getRecommendType() == RecommendType.SELLER) { // 판매자 근처
            result = kakaoApiService.findRecommendLocation(dto.getLongitude(), dto.getLatitude(), range);
        } else if (dto.getRecommendType() == RecommendType.MIDDLE) { // 중간
            double[] midpoint = calculateMidpoint(buyerX, buyerY, dto.getLongitude(), dto.getLatitude());
            result = kakaoApiService.findRecommendLocation(midpoint[0], midpoint[1], range);
        } else { // 구매자 근처
            result = kakaoApiService.findRecommendLocation(buyerX, buyerY, range);
        }
        return result;
    }

    private static int calculateRange(double lon1, double lat1, double lon2, double lat2) {
        // 위도와 경도를 라디안으로 변환
        double lat1Rad = Math.toRadians(lat1);
        double lon1Rad = Math.toRadians(lon1);
        double lat2Rad = Math.toRadians(lat2);
        double lon2Rad = Math.toRadians(lon2);

        // 하버사인 공식 적용
        double dlat = lat2Rad - lat1Rad;
        double dlon = lon2Rad - lon1Rad;

        double a = Math.sin(dlat / 2) * Math.sin(dlat / 2)
                + Math.cos(lat1Rad) * Math.cos(lat2Rad)
                + Math.sin(dlon / 2) * Math.sin(dlon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        int distance = (int) (EARTH_RADIUS * c); // 거리 (m)

        int range;

        if (distance < 10000) {
            range = distance;
        } else {
            range = 10000; // 10km를 초과하는 경우 10000미터로 설정
        }
        return range;
    }

    private static double[] calculateMidpoint(double lon1, double lat1, double lon2, double lat2) {
        // 위도와 경도를 라디안으로 변환
        double lat1Rad = Math.toRadians(lat1);
        double lon1Rad = Math.toRadians(lon1);
        double lat2Rad = Math.toRadians(lat2);
        double lon2Rad = Math.toRadians(lon2);

        // 각 위도 및 경도의 삼각함수 값 계산
        double dLon = lon2Rad - lon1Rad;
        double Bx = Math.cos(lat2Rad) * Math.cos(dLon);
        double By = Math.cos(lat2Rad) * Math.sin(dLon);

        double midLat = Math.atan2(
                Math.sin(lat1Rad) + Math.sin(lat2Rad),
                Math.sqrt((Math.cos(lat1Rad) + Bx) * (Math.cos(lat1Rad) + Bx) + By * By)
        );
        double midLon = lon1Rad + Math.atan2(By, Math.cos(lat1Rad) + Bx);

        // 결과를 도 단위로 변환
        double midLatDeg = Math.toDegrees(midLat);
        double midLonDeg = Math.toDegrees(midLon);

        return new double[]{midLonDeg, midLatDeg};
    }

}
