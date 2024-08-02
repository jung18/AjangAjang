import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTokenStore from '../../store/useTokenStore'; // 경로 수정

const Board = () => {
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);
  const accessToken = useTokenStore((state) => state.accessToken);
  const refreshToken = useTokenStore((state) => state.refreshToken);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const accessTokenFromCookie = getCookie('Authorization');
    const refreshTokenFromCookie = getCookie('Authorization-refresh');
    
    if (accessTokenFromCookie && !accessToken) {
      setAccessToken(accessTokenFromCookie.split('Bearer/')[1]);
    }
    if (refreshTokenFromCookie && !refreshToken) {
      setRefreshToken(refreshTokenFromCookie.split('Bearer/')[1]);
    }

    // 쿠키 삭제
    if (accessTokenFromCookie || refreshTokenFromCookie) {
      document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'Authorization-refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    console.log('Access Token from Cookie:', accessTokenFromCookie);
    console.log('Refresh Token from Cookie:', refreshTokenFromCookie);
  }, [setAccessToken, setRefreshToken, accessToken, refreshToken]);

  useEffect(() => {
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
  }, [accessToken, refreshToken]);

  return (
    <div>
      <h1>Board</h1>
      <Link to="/board/write">Write a new post dd</Link>
    </div>
  );
};

export default Board;
