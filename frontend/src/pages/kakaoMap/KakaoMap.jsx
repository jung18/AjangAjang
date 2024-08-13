import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useState } from "react";
import UseKakaoLoader from "./UseKakaoLoader";
import Modal from "./Modal";
import axios from "axios";
import useTokenStore from '../../store/useTokenStore';

export default function BasicMap() {

  UseKakaoLoader()

  const [locations, setLocations] = useState([{ title: '기본 주소', latlng: { lat: 36.3189632, lng: 127.3967337 } }]);
  const [state, setState] = useState({ lat: 36.3273754232809, lng: 127.434178396422 })
  const [level, setLevel] = useState(5)
  const [result, setResult] = useState("")
  const [showModal, setShowModal] = useState(false); // 모달 상태

  const accessToken = useTokenStore((state) => state.accessToken);

  const fetchLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    title: '현재 위치',
                    latlng: { lat: position.coords.latitude, lng: position.coords.longitude },
                };
                // 위치 정보를 추가하고, 지도의 중심을 해당 위치로 이동
                setLocations([userLocation]);
                setState(userLocation.latlng);
                console.log(userLocation)
            },
            (error) => {
                console.error("Error fetching location: ", error.message);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleAddress = async () => {
    try {
      const latlng = locations[0].latlng;
      const response = await axios.post("https://i11b210.p.ssafy.io:4443/api/address/xy", { latlng }, {
        headers: {
          'Authorization': `${accessToken}`
        }
      });
    } catch (error) {
      console.log(error);
      alert("주소 정보 반환에 실패했습니다.")
    }
  };

  const handleRecommend = async () => {
    try {
      const createTradeDto = {
        // boardId,
        // sellerId,
        // buyuerId
        // recommendType,
        // 판매자 위치 정보
        // longitude,
        // latitude
      };
      const response = await axios.post("https://i11b210.p.ssafy.io:4443/api/trade", { createTradeDto }, {
        headers: {
          'Authorization': `${accessToken}`
        }
      });
      const { tradeId, recommendDto } = response.data
      const markerList = recommendDto.map(item => ({
        title: item.placeName,
        latlng: {
          lat: item.latitude,
          lng: item.longitude
        }
      }));
      
      setLocations(markerList);
      setState(markerList[0])

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>지도 열기</button>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Map center={state} style={{ width: "100%", height: "350px" }} level={level} 
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
            <button onClick={() => setLevel(level + 1)}>-</button>
            <button onClick={() => setLevel(level - 1)}>+</button>
            <button onClick={fetchLocation}>현재 위치</button>
            <p id="result">{result}</p>
        </Map>
      </Modal>
      {/* <p>
        <button onClick={() => setState({ center: { lat: 36.3189632, lng: 127.3967337 } })}>
          지도 중심좌표 이동시키기
        </button>
      </p> */}
    </>
  )
}