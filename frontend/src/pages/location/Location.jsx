import React, { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import UseKakaoLoader from "../kakaoMap/UseKakaoLoader";
import axios from "axios";
import useTokenStore from "../../store/useTokenStore";

import "./Location.css";

function Location() {
  UseKakaoLoader();

  const [locations, setLocations] = useState([
    { title: "기본 주소", latlng: { lat: 36.3189632, lng: 127.3967337 } }
  ]);
  const [state, setState] = useState({ lat: 36.3273754232809, lng: 127.434178396422 });
  const [level, setLevel] = useState(5);
  const [result, setResult] = useState("");
  const [markerList, setMarkerList] = useState([]);
  const accessToken = useTokenStore((state) => state.accessToken);

  useEffect(() => {
    handleRecommend();
  }, []); // 빈 배열을 추가하여 한 번만 호출되도록 설정

  const confirmBtnClickHandler = async () => {
    const data = await handleRecommend(); // 비동기로 호출하고 기다림
    setMarkerList(data); // 결과를 상태에 설정
    setLocations(data); // location도 업데이트
    setState(data[0]?.latlng || state); // 첫 번째 위치로 맵 상태를 업데이트
  };

  const handleRecommend = async () => {
    try {
      const createTradeDto = {
        buyerId: 3,
        recommendType: "SELLER",
        longitude: 126.97867489436669,
        latitude: 37.566833216725115
      };

      const url = "https://i11b210.p.ssafy.io:4443/api/address/recommend";

      const response = await axios.post(url, createTradeDto, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `${accessToken}`
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

  return (
    <div className="location-page">
      <div className="location-options">
        <button type="button" onClick={confirmBtnClickHandler}>
          탐색
        </button>
        <select className="safe-location">
          <option>판매자 가까운 쪽</option>
          <option>구매자 가까운 쪽</option>
          <option>중간 위치</option>
        </select>
      </div>
      <div className="map-container">
        <Map
          center={state}
          style={{ width: "100%", height: "100%" }}
          level={level}
          onClick={(_, mouseEvent) => {
            const pointLatLng = mouseEvent.latLng;
            setResult(`위도 ${pointLatLng.getLat()} 경도 ${pointLatLng.getLng()}`);
          }}
        >
          {locations.map((loc, idx) => (
            <MapMarker
              key={`${loc.title}-${loc.latlng}`}
              position={loc.latlng}
              image={{
                src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                size: { width: 24, height: 35 }
              }}
              title={loc.title}
            />
          ))}
        </Map>
      </div>
      <div className="location-inputs">
        <div className="location-input">
          판매자 위치
          <input />
        </div>
        <div className="location-input">
          구매자 위치
          <select>
            <option>판매자 가까운 쪽</option>
          </select>
        </div>
      </div>
      <div className="location-list">
        위치 목록
        <div className="location-items location-scroll">
          {markerList.map((item, idx) => (
            <div key={idx} className="location-item" onClick={() => setState(item.latlng)}>
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Location;
