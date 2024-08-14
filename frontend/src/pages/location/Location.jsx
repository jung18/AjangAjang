import React, { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import UseKakaoLoader from "./UseKakaoLoader";
import axios from "axios";
import useTokenStore from "../../store/useTokenStore";
import { fetchUserData, fetchRoomData } from "../../api/locationService";
import { useParams } from "react-router-dom";

import "./Location.css";

function Location() {
  UseKakaoLoader();

  const [locations, setLocations] = useState([
    { title: "", latlng: { lat: null, lng: null } }
  ]);
  const [center, setCenter] = useState({ lat: null, lng: null });
  const [level, setLevel] = useState(5);
  const [pointLatLng, setPointLatLng] = useState({ lat: null, lng: null }); // 클릭한 곳의 위도경도
  const [markerList, setMarkerList] = useState([]);
  const accessToken = useTokenStore((state) => state.accessToken);
  const [recommendType, setRecommendType] = useState(''); // 추천 위치 타입
  const [sellerLocation, setSellerLocation] = useState(''); // 판매자 위치 (게시글에 설정된 위치)
  const [buyerLocation, setBuyerLocation] = useState(''); // 구매자 위치
  const [buyerId, setBuyerId] = useState(''); // 구매자 아이디
  const [sellerId, setSellerId] = useState(''); // 판매자 아이디
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커
  const [roomData, setRoomData] = useState(null); // 채팅방 정보
  const [buyerData, setBuyerData] = useState(null); // 구매자 정보
  const [sellerData, setSellerData] = useState(null); // 판매자 정보
  const [loading, setLoading] = useState(true); // 로딩 상태
  const { roomId } = useParams(); // URL 경로에서 roomId를 가져옴

  // 채팅방 정보
     const getRoomData = async () => {
      try {
        const data = await fetchRoomData(roomId);
        setRoomData(data);
        setSellerLocation(data.sellerAddress)
        const creatorUserId = data.creatorUserId;
        
        data.userRooms.forEach(room => {
          if (room.userId === creatorUserId) {
            setBuyerId(room.userId);
          } else {
              setSellerId(room.userId);
          }
        });

        setCenter({ lat: data.latitude, lng: data.longitude })
      } catch (error) {
        console.error(error);
      }};

     const getBuyerData = async () => {
        try {
          const data = await fetchUserData(buyerId);
          setBuyerData(data);
          setBuyerLocation(data.mainAddressName);
        } catch (error) {
          console.error(error);
        }
     };

     const getSellerData = async () => {
      try {
        const data = await fetchUserData(sellerId);
        setSellerData(data)
      } catch (error) {
        console.error(error);
      }
   };

   const recommendDataInit = async () => {
    try {
      getRoomData();
      getBuyerData();
      getSellerData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recommendDataInit();
    // handleRecommend();
  }, []); // 빈 배열을 추가하여 한 번만 호출되도록 설정

  const confirmBtnClickHandler = async () => {
    const data = await handleRecommend(); // 비동기로 호출하고 기다림
    setMarkerList(data); // 결과를 상태에 설정
    setLocations(data); // location도 업데이트
    setCenter(data[0]?.latlng || center); // 첫 번째 위치로 맵 상태를 업데이트
  };

  const handleRecommendChange = (event) => {
    const selectedValue = event.target.value;
    setRecommendType(selectedValue);
  };

  const handleMarkerClick = (latlng, title) => {
    setCenter(latlng); // 지도 중심 이동
    setSelectedMarker(title); // 선택된 마커의 title로 상태 업데이트
  };

  const handleRecommend = async () => {
    try {
      const createTradeDto = {
        buyerId: buyerId,
        recommendType: recommendType,
        longitude: roomData.longitude,
        latitude: roomData.latitude
      };

      const url = "https://i11b210.p.ssafy.io:4443/api/address/recommend";

      const response = await axios.post(url, createTradeDto, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${accessToken}`
        }
      });

      const recommendDto = response.data;
      const dataList = recommendDto.data.map((item, idx) => ({
        title: item.placeName,
        latlng: {
          lat: item.latitude,
          lng: item.longitude
        }
      }));

      return dataList;
    } catch (error) {
      console.log(error);
      return []; // 에러가 발생하면 빈 배열 반환
    }
  };

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  return (
    <div className="location-page">
      <div className="location-options">
        <button type="button" onClick={confirmBtnClickHandler}>
          탐색
        </button>
        <select className="safe-location" defaultValue="" onChange={handleRecommendChange}>
        <option value="" disabled>추천 기준</option>
          <option value="SELLER">판매자 가까운 쪽</option>
          <option value="BUYER">구매자 가까운 쪽</option>
          <option value="MIDDLE">중간 위치</option>
        </select>
      </div>
      <div className="map-container">
        <Map
          center={center}
          style={{ width: "100%", height: "100%" }}
          level={level}
          onClick={(_, mouseEvent) => {
            const pointLatLng = mouseEvent.latLng;
            setPointLatLng({lat: pointLatLng.getLat(),  lng: pointLatLng.getLng()});
          }}
        >
          {locations.map((loc, idx) => (
            <MapMarker
              key={`${loc.title}-${loc.latlng}`}
              position={loc.latlng}
              image={{
                src: selectedMarker === loc.title 
                      ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png" 
                      : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                size: { width: 24, height: 35 }
              }}
              title={loc.title}
              onClick={() => handleMarkerClick(loc.latlng, loc.title)}
            />
          ))}
        </Map>
      </div>
      <div className="location-inputs">
        <div className="location-input">
          판매자 위치
          <input value={sellerLocation} readOnly />
        </div>
        <div className="location-input">
          구매자 위치
          <input value={buyerLocation} readOnly />
        </div>
      </div>
      {markerList.length > 0 && (
      <div className="location-list">
        추천 장소
        <div className="location-items location-scroll">
          {markerList.map((item, idx) => (
            <div key={idx} className="location-item" onClick={() => handleMarkerClick(item.latlng, item.title)}>
              {item.title}
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}

export default Location;
