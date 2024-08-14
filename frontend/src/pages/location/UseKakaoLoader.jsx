import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"

function UseKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: "97461c7397262ab297420b6d4513472c",
    libraries: ["clusterer", "drawing", "services"],
  })
}

export default UseKakaoLoader;