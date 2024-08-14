import React, { useEffect, useState } from "react";
import { fetchBoardList } from "../../api/boardService";
import useTokenStore from '../../store/useTokenStore';
import useUserStore from "../../store/useUserStore";
import apiClient from "../../api/apiClient";
import BoardList from "./components/boardList/BoardList";
import SelectBox from "../../components/SelectBox";
import "./Board.css";

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [addressList, setAddressList] = useState([]);
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
      setBoards(boardList.searchResult.content || []);

      const combinedAddresses = (boardList.addressList || []).map(address => address.fullAddress);
      setAddressList(combinedAddresses);

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
      const response = await apiClient.get("http://localhost:8080/api/user/my");
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
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const accessTokenFromCookie = getCookie('Authorization');
    const refreshTokenFromCookie = getCookie('Authorization-refresh');
    
    if (accessTokenFromCookie && !accessToken) {
      setAccessToken(accessTokenFromCookie);
    }
    if (refreshTokenFromCookie && !refreshToken) {
      setRefreshToken(refreshTokenFromCookie);
    }

    if (accessTokenFromCookie || refreshTokenFromCookie) {
      document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'Authorization-refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    if (!user) {
      fetchUserData();
    }

    return () => {
      window.removeEventListener("resize", calculateMaxHeight);
    };
  }, [setAccessToken, setRefreshToken, accessToken, refreshToken, user, setUser]);

  // 자동 추천 체크박스 상태 변경 핸들러
  const handleAutoRecommendChange = async (event) => {
    setAutoRecommend(event.target.checked);
    if (event.target.checked) {
      try {
        const response = await apiClient.post("/api/board/recommendation", {
          page: 0,
          size: 10,
        });
        setBoards(response.data.content || []);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("대표 자녀가 등록되지 않았습니다.");
          setAutoRecommend(false); // 체크박스 해제
        } else {
          console.error("Failed to fetch recommended boards", error);
        }
      }
    } else {
      getBoards(); // 자동 추천이 해제되면 원래의 게시판 목록을 가져옵니다
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="board-page" style={{ maxHeight: `${maxHeight}px` }}>
      <div className="user-option">
        <SelectBox optionList={addressList} />
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
