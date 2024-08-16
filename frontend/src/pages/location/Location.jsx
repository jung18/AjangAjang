import React, { useState, useEffect } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import UseKakaoLoader from "./UseKakaoLoader";
import useTokenStore from "../../store/useTokenStore";
import { fetchUserData, fetchRoomData } from "../../api/locationService";
import { useParams } from "react-router-dom";

import RedMarker from "../../assets/icons/red-marker.png"
import BlueMarker from "../../assets/icons/blue-marker.png";

import "./Location.css";

function Location() {
  UseKakaoLoader();

  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState({ lat: null, lng: null });
  const [level, setLevel] = useState(5);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
  const [sellerLatLng, setSellerLatLng] = useState({ lat: null, lng: null });
  const [buyerLatLng, setBuyerLatLng] = useState({ lat: null, lng: null });
  const [sellerRoute, setSellerRoute] = useState({ distance: null, duration: null, path: [] });
  const [buyerRoute, setBuyerRoute] = useState({ distance: null, duration: null, path: [] });
  const [sellerLocation, setSellerLocation] = useState('');
  const [buyerLocation, setBuyerLocation] = useState('');
  const [buyerId, setBuyerId] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [recommendType, setRecommendType] = useState(''); 
  const [roomData, setRoomData] = useState(null);
  const [buyerData, setBuyerData] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [markerList, setMarkerList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams();
  
  const getRoomData = async () => {
    try {
      const data = await fetchRoomData(roomId);
      setRoomData(data);

      const creatorUserId = data.creatorUserId;
      
      let buyerId = '';
      let sellerId = '';

      data.userRooms.forEach(room => {
        if (room.userId === creatorUserId) {
          buyerId = room.userId;
        } else {
          sellerId = room.userId;
        }
      });

      if (buyerId) {
        setBuyerId(buyerId)
        const buyerData = await fetchUserData(buyerId);
        setBuyerData(buyerData);
        setBuyerLocation(buyerData.mainAddressName);
        setBuyerLatLng({ lat: buyerData.latitude, lng: buyerData.longitude });
      }

      if (sellerId) {
        setSellerId(sellerId)
        const sellerData = await fetchUserData(sellerId);
        setSellerData(sellerData);
        setSellerLocation(sellerData.mainAddressName);
        setSellerLatLng({ lat: sellerData.latitude, lng: sellerData.longitude });
      }

      setCenter({ lat: data.latitude, lng: data.longitude });
    } catch (error) {
      console.error(error);
    }
  };

  const recommendDataInit = async () => {
    try {
      await getRoomData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recommendDataInit();
  }, []);

  const confirmBtnClickHandler = async () => {
    const data = await handleRecommend();
    setMarkerList(data); 
    setLocations(data);
    setCenter(data[0]?.latlng || center);
  };

  const handleRecommendChange = (event) => {
    const selectedValue = event.target.value;
    setRecommendType(selectedValue);
  };

  const toggleMarker = async (index, latlng) => {
    if (selectedMarkerIndex === index) {
      setSelectedMarkerIndex(null); 
      setSellerRoute({ distance: null, duration: null, path: [] });
      setBuyerRoute({ distance: null, duration: null, path: [] });
    } else {
      setSelectedMarkerIndex(index); 

      if (sellerLatLng.lat && sellerLatLng.lng) {
        const sellerRouteData = await getRouteData(sellerLatLng, latlng);
        setSellerRoute(sellerRouteData);
      }

      if (buyerLatLng.lat && buyerLatLng.lng) {
        const buyerRouteData = await getRouteData(buyerLatLng, latlng);
        setBuyerRoute(buyerRouteData);
      }
    }
  };

  const fetchData = async (recodata) => {
    try {
      const { accessToken } = useTokenStore.getState();
  
      const response = await fetch("https://i11b210.p.ssafy.io:4443/api/address/recommend", {
        method: "POST",
        headers: {
          "Authorization": `${accessToken}`,
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(recodata)
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching my like list", error);
      throw error;
    }
  };

  const handleRecommend = async () => {
    try {
      const createTradeDto = {
        buyerId: buyerId,
        recommendType: recommendType,
        longitude: sellerData.longitude,
        latitude: sellerData.latitude
      };
      const response = await fetchData(createTradeDto);
      const dataList = response.data.map((item, idx) => ({
        title: item.placeName,
        latlng: {
          lat: item.latitude,
          lng: item.longitude
        }
      }));

      return dataList;
    } catch (error) {
      console.log(error);
      return []; 
    }
  };

  const getRouteData = async (origin, destination) => {
    try {
      const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin.lng},${origin.lat}&destination=${destination.lng},${destination.lat}&priority=RECOMMEND`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `KakaoAK 429a317e8b573f6ae550bebbd54536d5`,
        },
      });

      const data = await response.json();
      const path = data.routes[0].sections[0].roads.flatMap(road =>
        road.vertexes.reduce((acc, val, idx, arr) => {
          if (idx % 2 === 0) acc.push({ lat: arr[idx + 1], lng: arr[idx] });
          return acc;
        }, [])
      );

      return {
        distance: (data.routes[0].summary.distance / 1000).toFixed(2),
        duration: formatDuration(data.routes[0].summary.duration),
        path,
      };
    } catch (error) {
      console.error('Error fetching route:', error);
      return { distance: null, duration: null, path: [] };
    }
  };

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours > 0 ? `${hours}차량 ` : ''}${minutes}분`;
  };

  if (loading) {
    return <div>Loading...</div>;
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
        >
          {/* 추천 마커 및 토글 기능 */}
          {markerList.map((loc, idx) => (
            (selectedMarkerIndex === null || selectedMarkerIndex === idx) && (
              <MapMarker
                key={`${loc.title}-${loc.latlng}`}
                position={loc.latlng}
                image={{
                  src: selectedMarkerIndex === idx
                    ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"
                    : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                  size: { width: 24, height: 35 }
                }}
                title={loc.title}
                onClick={() => toggleMarker(idx, loc.latlng)}
              />
            )
          ))}

          {/* 판매자 마커 */}
          {sellerLatLng.lat && sellerLatLng.lng && (
            <MapMarker
              position={sellerLatLng}
              image={{
                src: RedMarker, // 빨간색 마커 이미지
                size: { width: 24, height: 35 }
              }}
              title="판매자 위치"
            />
          )}

          {/* 구매자 마커 */}
          {buyerLatLng.lat && buyerLatLng.lng && (
            <MapMarker
              position={buyerLatLng}
              image={{
                src: BlueMarker, // 파란색 마커 이미지
                size: { width: 24, height: 35 }
              }}
              title="구매자 위치"
            />
          )}

          {/* 판매자와의 경로 */}
          {selectedMarkerIndex !== null && sellerRoute.path.length > 0 && (
            <Polyline
              path={sellerRoute.path}
              strokeWeight={5}
              strokeColor="#FF0000" // 빨간색 경로
              strokeOpacity={0.7}
              strokeStyle="solid"
            />
          )}

          {/* 구매자와의 경로 */}
          {selectedMarkerIndex !== null && buyerRoute.path.length > 0 && (
            <Polyline
              path={buyerRoute.path}
              strokeWeight={5}
              strokeColor="#0000FF" // 파란색 경로
              strokeOpacity={0.7}
              strokeStyle="solid"
            />
          )}
        </Map>
      </div>

      <div className="location-inputs-horizontal">
        <div className="location-input">
          판매자
          <textarea
            value={`${sellerRoute.distance ? `거리: ${sellerRoute.distance} km\n` : ''}${sellerRoute.duration ? `시간: ${sellerRoute.duration}` : ''}`}
            readOnly
            style={{ color: "#FF0000" }} // 텍스트 색상 빨간색
            rows="3"
          />
        </div>
        <div className="location-input">
          구매자
          <textarea
            value={`${buyerRoute.distance ? `거리: ${buyerRoute.distance} km\n` : ''}${buyerRoute.duration ? `시간: ${buyerRoute.duration}` : ''}`}
            readOnly
            style={{ color: "#0000FF" }} // 텍스트 색상 파란색
            rows="3"
          />
        </div>
      </div>

      {markerList.length > 0 && (
        <div className="location-list">
          추천 장소
          <div className="location-items location-scroll">
            {markerList.map((item, idx) => (
              <div
                key={idx}
                className="location-item"
                onClick={() => toggleMarker(idx, item.latlng)}
                style={{
                  backgroundColor: selectedMarkerIndex === idx ? "#ddd" : "#fff",
                }}
              >
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
