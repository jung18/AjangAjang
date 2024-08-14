import React, { useState, useEffect } from "react";
import { fetchMyLikeList } from "../../api/boardService";
import styles from"./MyLike.module.css";
import LikeBoardList from "../board/components/boardList/BoardList";
import useTokenStore from '../../store/useTokenStore';

const MyLike = () => {
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
            const boardList = await fetchMyLikeList();
            setBoards(boardList);
          } catch (error) {
            console.error("Failed to fetch my likes", error);
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
      <div>
        <div className={styles.boardTitle}>찜한 내역</div>
        <div className={styles.boardPage} style={{ maxHeight: `${maxHeight}px` }}>
          {!boards || boards.length === 0 ? (
            <div className={styles.notFoundContent}>찜한 글이 없습니다.</div>
          ) : (
            <LikeBoardList boards={boards} />
          )}
        </div>
      </div>
    );
}

export default MyLike;