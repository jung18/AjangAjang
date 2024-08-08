import React, { useState, useEffect } from "react";
import { fetchMyBoardList } from "../../api/boardService";
import styles from"./MyBoard.module.css";
import MyBoardList from "./components/myBoardList/MyBoardList";
import useTokenStore from '../../store/useTokenStore';
import SelectBox from "../../components/SelectBox";

const MyBoard = () => {
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
            const boardList = await fetchMyBoardList();
            setBoards(boardList);
          } catch (error) {
            console.error("Failed to fetch my boards", error);
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
    
    return (
      <div className={styles.boardPage} style={{ maxHeight: `${maxHeight}px` }}>
        {!boards || boards.length === 0 ? (
          <div className={styles.notFoundContent}>내 게시글이 존재하지 않습니다.</div>
        ) : (
          <MyBoardList boards={boards} />
        )}
      </div>
    );
}

export default MyBoard;