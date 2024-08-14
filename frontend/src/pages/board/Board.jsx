import React, { useEffect, useState } from "react";
import { fetchBoardList } from "../../api/boardService"; // 기본 게시판 목록을 가져오는 함수
import { updateAddressRep } from "../../api/myInfoService";

import useTokenStore from "../../store/useTokenStore";
import useUserStore from "../../store/useUserStore";
import apiClient from "../../api/apiClient";
import BoardList from "./components/boardList/BoardList";
import SelectBox from "../../components/SelectBox";
import "./Board.css";

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [combinedAddressList, setCombinedAddressList] = useState([]);
  const [repAddressIdx, setRepAddressIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [maxHeight, setMaxHeight] = useState(0);
  const [autoRecommend, setAutoRecommend] = useState(false);

  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);
  const accessToken = useTokenStore((state) => state.accessToken);
  const refreshToken = useTokenStore((state) => state.refreshToken);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const getBoards = async () => {
    try {
      const boardList = await fetchBoardList();
      setBoards(boardList.searchResult.content || []); // 응답 데이터의 content 배열을 사용하고 기본값으로 빈 배열 설정

      const repIndex = (boardList.addressList || []).findIndex(
        (address) => address.rep === true
      );
      setRepAddressIdx(repIndex);
      console.log(boardList.addressList);
      console.log(repIndex);

      setAddressList(boardList.addressList);

      // addressList의 각 요소를 하나의 문자열로 합치기
      const combinedAddresses = (boardList.addressList || []).map((address) => {
        return address.fullAddress;
      });

      setCombinedAddressList(combinedAddresses);
    } catch (error) {
      console.error("Failed to fetch boards", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMaxHeight = () => {
    const totalHeight = window.innerHeight;
    setMaxHeight(totalHeight - 170);
  };

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get(
        "https://i11b210.p.ssafy.io:4443/api/user/my"
      );
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  useEffect(() => {
    getBoards();
    calculateMaxHeight();
    window.addEventListener("resize", calculateMaxHeight);

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const accessTokenFromCookie = getCookie("Authorization");
    const refreshTokenFromCookie = getCookie("Authorization-refresh");

    if (accessTokenFromCookie && !accessToken) {
      setAccessToken(accessTokenFromCookie);
    }
    if (refreshTokenFromCookie && !refreshToken) {
      setRefreshToken(refreshTokenFromCookie);
    }

    if (accessTokenFromCookie || refreshTokenFromCookie) {
      document.cookie =
        "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "Authorization-refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    if (!user) {
      fetchUserData();
    }

    return () => {
      window.removeEventListener("resize", calculateMaxHeight);
    };
  }, [
    setAccessToken,
    setRefreshToken,
    accessToken,
    refreshToken,
    user,
    setUser,
  ]);

  const handleChange = (e) => {
    console.log("Address List:", addressList);
    console.log("Current Rep Address Index:", repAddressIdx);
    console.log("Selected Value:", e.target.value);
    const id = addressList[e.target.value].addressId;
    updateAddressRep(id);
    setRepAddressIdx(e.target.value); // 선택된 주소를 업데이트
    window.location.reload();
  };

  // 자동 추천 체크박스 상태 변경 핸들러
  const handleAutoRecommendChange = async (event) => {
    setAutoRecommend(event.target.checked);
    if (event.target.checked) {
      try {
        const response = await apiClient.post("/api/board/recommendation", {
          page: 0,
          size: 100,
        });
        console.log("Recommendation API Response:", response); // 전체 응답을 콘솔에 출력

        const recommendedBoards = response.data.searchResult.content;
        console.log("Recommended boards before setting state:", recommendedBoards);

        setBoards(recommendedBoards || []);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("추천 게시판을 불러올 수 없습니다.");
          setAutoRecommend(false); // 체크박스 해제
        } else {
          console.error("Failed to fetch recommended boards", error);
        }
      }
    } else {
      getBoards(); // 자동 추천이 해제되면 원래의 게시판 목록을 가져옵니다
    }
  };

  // 상태 변경 후의 boards 값을 확인하기 위해 useEffect 사용
  useEffect(() => {
    console.log("Boards state changed:", boards);
  }, [boards]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="board-page" style={{ maxHeight: `${maxHeight}px` }}>
      <div className="user-option">
        <select value={repAddressIdx} onChange={handleChange}>
          {combinedAddressList.map((address, index) => (
            <option key={index} value={index}>
              {address}
            </option>
          ))}
        </select>
        <label className="recommand">
          자동 추천
          <input
            type="checkbox"
            checked={autoRecommend}
            onChange={handleAutoRecommendChange}
          />
        </label>
      </div>

      {!boards || boards.length === 0 ? (
        <div className="not-found-content">게시글이 존재하지 않습니다.</div>
      ) : (
        <BoardList boards={boards} />
      )}
    </div>
  );
};

export default Board;
