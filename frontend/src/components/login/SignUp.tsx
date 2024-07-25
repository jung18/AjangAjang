import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      nickname,
      phone
    };

    const token = getAuthorizationToken();
    const url = 'http://localhost:8080/sign-up'; // 변경 필요

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
      console.log('Response:', response.data);
      navigate('/'); // 전송이 완료되면 리다이렉션
    } catch (error) {
      console.error('Error submitting the form', error);
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
