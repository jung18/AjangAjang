// src/api/apiClient.js
import axios from 'axios';
import useTokenStore from '../store/useTokenStore'; // zustand 스토어 import

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/', // 서버 URL
  withCredentials: true, // 자격 증명(쿠키 등)을 포함하여 요청
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useTokenStore.getState().accessToken;
    if (accessToken) {
      config.headers['Authorization'] = `${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = useTokenStore.getState().refreshToken;

    if (error.response && error.response.status === 401 && refreshToken) {
      try {
        console.log('Access token expired. Attempting to refresh.');

        const response = await axios.post(
          'http://localhost:8080/reissue',
          {},
          {
            headers: {
              'Authorization-refresh': `${refreshToken}`,
            },
          }
        );

        // 새 액세스 토큰을 받아온다
        const newAccessToken = response.headers['authorization'];
        console.log('New Access Token:', newAccessToken);

        if (newAccessToken) {
          // 토큰을 상태에 저장
          useTokenStore.getState().setAccessToken(newAccessToken);

          // 원래 요청 헤더에 새로운 액세스 토큰 설정
          originalRequest.headers['Authorization'] = `${newAccessToken}`;
          console.log('Original Request with new Access Token:', originalRequest);

          // 원래 요청 재시도
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token', refreshError);

        if (refreshError.response && refreshError.response.status === 401) {
          // 리프레시 토큰도 만료된 경우
          alert('토큰이 만료되었습니다. 다시 로그인해 주세요.');
          useTokenStore.getState().setAccessToken(null);
          useTokenStore.getState().setRefreshToken(null);
          window.location.href = '/'; // 로그인 페이지로 리다이렉트
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
