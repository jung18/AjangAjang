import React, {useState, useEffect} from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import UseKakaoLoader from "../kakaoMap/UseKakaoLoader";

import "./Location.css";
import apiClient from "../../api/apiClient";

function Location() {

  UseKakaoLoader()

  const [locations, setLocations] = useState([{ title: '기본 주소', latlng: { lat: 36.3189632, lng: 127.3967337 } }]);
  const [state, setState] = useState({ lat: 36.3273754232809, lng: 127.434178396422 })
  const [level, setLevel] = useState(5)
  const [result, setResult] = useState("")
  const [markerList, setMarkerList] = useState([]);

  useEffect(() => {
    handleRecommend();
  }, []);

  const handleRecommend = async () => {
    try {
      const createTradeDto = {
        // buyuerId
        // recommendType,
        // 판매글 위치 정보
        // longitude,
        // latitude
      };

      const url = "/api/address/recommend";

      const response = await apiClient.post(url, createTradeDto, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const { recommendDto } = response.data
      const markerList = recommendDto.map(item => ({
        title: item.placeName,
        latlng: {
          lat: item.latitude,
          lng: item.longitude
        }
      }));
      
      setMarkerList(markerList);
      setLocations(markerList);
      setState(markerList[0])

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="location-page">
      <div className="location-options">
        <button type="button" onClick={handleRecommend}>
          탐색
        </button>
        <select className="safe-location">
          <option>판매자 가까운 쪽</option>
          <option>구매자 가까운 쪽</option>
          <option>중간 위치</option>
        </select>
      </div>
      <div className="map-container">
        <Map center={state} style={{ width: "100%", height: "100%" }} level={level} 
                  onClick={(_, mouseEvent) => {const pointLatLng = mouseEvent.latLng 
                                              setResult(`위도 ${pointLatLng.getLat()} 경도 ${pointLatLng.getLng()}`)}}>
            {locations.map((loc, idx) => (
              <MapMarker
                  key={`${loc.title}-${loc.latlng}`}
                  position={loc.latlng}
                  image={{
                      src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                      size: { width: 24, height: 35 },
                  }}
                  title={loc.title}
              />
            ))}
        </Map>
      </div>
      <div className="location-inputs">
        <div className="location-input">
          판매자 위치
          <input></input>
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
        <div className="location-items">
          {markerList.map((item, idx) => {
            <div className="location-item" onClick = {setState(item.latlng)}>{item.title}</div>
          })}
        </div>
      </div>
    </div>
  );
}

export default Location;
