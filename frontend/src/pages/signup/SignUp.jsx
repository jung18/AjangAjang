import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useTokenStore from '../../store/useTokenStore'; // 경로 수정

const SignUp = () => {
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const getAuthorizationToken = () => {
    const name = "Authorization=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        const token = cookie.substring(name.length, cookie.length);
        return token;
      }
    }
    return "";
  };

  const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nickname,
      phone
    };

    const token = getAuthorizationToken();
    const url = 'http://localhost:8080/sign-up'; // 서버 URL

    console.log('Authorization Token:', token); // 토큰 출력
    console.log('Request URL:', url); // URL 출력
    console.log('Request Data:', data); // 데이터 출력

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // Bearer 접두사 포함된 토큰
        },
      });

      console.log('Response Status:', response.status); // 응답 상태 코드 출력
      console.log('Response Data:', response.data); // 응답 데이터 출력

      // 응답 헤더를 소문자로 변환하여 접근
      const headers = Object.keys(response.headers).reduce((acc, key) => {
        acc[key.toLowerCase()] = response.headers[key];
        return acc;
      }, {});

      const accessToken = headers['authorization'];
      const refreshToken = headers['authorization-refresh'];

      console.log('Access Token:', accessToken); // 토큰 값 로그 출력
      console.log('Refresh Token:', refreshToken); // 토큰 값 로그 출력

      if (!accessToken || !refreshToken) {
        throw new Error('Authorization headers are missing');
      }

      // Zustand 스토어에 토큰 저장
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      // 쿠키에서 토큰을 지우기
      clearAllCookies();

      alert('회원가입이 완료되었습니다.');
      navigate('/direct'); // 회원가입 완료 후 메인 페이지로 이동
    } catch (error) {
      console.error('Error submitting the form', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            style={{ width: '100%', marginBottom: '20px', padding: '10px', fontSize: '16px' }}
          />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            style={{ width: '100%', marginBottom: '20px', padding: '10px', fontSize: '16px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
