import React, { useEffect, useState } from "react";
import { fetchBoardList } from "../../api/boardService";
import useTokenStore from '../../store/useTokenStore'; // 경로 수정

import BoardList from "./components/boardList/BoardList";
import SelectBox from "../../components/SelectBox";

import "./Board.css";

const Board = ({ salseType }) => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxHeight, setMaxHeight] = useState(0);

  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);
  const accessToken = useTokenStore((state) => state.accessToken);
  const refreshToken = useTokenStore((state) => state.refreshToken);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const boardList = await fetchBoardList();
        setBoards(boardList);
      } catch (error) {
        console.error("Failed to fetch boards", error);
      } finally {
        setIsLoading(false); // 데이터 로드가 끝나면 로딩 상태를 false로 설정
      }
    };

    const calculateMaxHeight = () => {
      const totalHeight = window.innerHeight;
      setMaxHeight(totalHeight - 170);
    };

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

    // 쿠키 삭제
    if (accessTokenFromCookie || refreshTokenFromCookie) {
      document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'Authorization-refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    console.log('Access Token from Cookie:', accessTokenFromCookie);
    console.log('Refresh Token from Cookie:', refreshTokenFromCookie);

    return () => {
      window.removeEventListener("resize", calculateMaxHeight);
    };
  }, [setAccessToken, setRefreshToken, accessToken, refreshToken]);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  //optionList에 사용자 주소 목록 넣어줘야함
  return (
    <div className="board-page" style={{ maxHeight: `${maxHeight}px` }}>
      <div className="user-option">
        <SelectBox
          optionList={["대전시 유성구 덕명동", "대전시 유성구 계산동"]}
        />
        <label className="recommand">
          자동 추천
          <input type="checkbox" />
        </label>
      </div>

      {!boards.data || boards.data.length === 0 ? (
        <div className="not-found-content">게시글이 존재하지 않습니다.</div>
      ) : (
        <BoardList boards={boards.data} sType={salseType} />
      )}
    </div>
  );
};

export default Board;
