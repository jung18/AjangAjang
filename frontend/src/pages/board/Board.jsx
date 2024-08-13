import React, { useEffect, useState } from "react";
import { fetchBoardList } from "../../api/boardService";
import useTokenStore from '../../store/useTokenStore'; // 경로 수정

import BoardList from "./components/boardList/BoardList";
import SelectBox from "../../components/SelectBox";

import "./Board.css";

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [addressList, setAddressList] = useState([]);

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
        setBoards(boardList.searchResult.content || []); // 응답 데이터의 content 배열을 사용하고 기본값으로 빈 배열 설정
        
        // addressList의 각 요소를 하나의 문자열로 합치기
        const combinedAddresses = (boardList.addressList || []).map(address => {
          return address.fullAddress;
        });

        setAddressList(combinedAddresses);

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

  // optionList에 사용자 주소 목록 넣어줘야함
  return (
    <div className="board-page" style={{ maxHeight: `${maxHeight}px` }}>
      <div className="user-option">
        <SelectBox
          optionList={addressList}
        />
        <label className="recommand">
          자동 추천
          <input type="checkbox" />
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
