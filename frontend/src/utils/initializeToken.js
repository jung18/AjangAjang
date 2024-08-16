// src/utils/initializeToken.js
import useTokenStore from '../store/useTokenStore';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const initializeToken = () => {
  const setAccessToken = useTokenStore.getState().setAccessToken;
  const setRefreshToken = useTokenStore.getState().setRefreshToken;

  // 쿠키에서 토큰을 가져와 zustand 상태로 설정
  const accessToken = getCookie('Authorization');
  const refreshToken = getCookie('Authorization-refresh');

  if (accessToken) {
    setAccessToken(accessToken);
  }
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
};

export default initializeToken;
