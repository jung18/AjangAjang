// SignUp.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useTokenStore from '../../store/useTokenStore'; // 경로 수정
import styles from './SignUp.module.css'; // CSS 파일 import

const SignUp = () => {
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [addressName, setAddressName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false); // 초기값 false로 수정

  const navigate = useNavigate();
  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);
  const accessToken = useTokenStore((state) => state.accessToken);

  useEffect(() => {
    // window.setAddressName을 정의하여 findAddr 함수에서 호출할 수 있도록 함
    window.setAddressName = setAddressName;
  }, []);

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleSendSms = async () => {
    try {
      const response = await axios.post('http://:8080/api/user/sms/send', { phone }, {
        headers: {
          'Authorization': `${accessToken}`
        }
      });
      if (response.data.success) {
        alert('인증 코드가 전송되었습니다.');
      }
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  };
  
  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('https://i11b210.p.ssafy.io:4443/api/user/sms/confirm', { phone, certificationNumber: verificationCode }, {
        headers: {
          'Authorization': `${accessToken}`
        }
      });

      if (response.status === 200) { // 상태 코드 200 확인
        setIsVerified(true);
        alert('인증이 완료되었습니다.');
      } else {
        alert('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Failed to verify code:', error);
      alert('인증 코드 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert('전화번호 인증을 완료해주세요.');
      return;
    }

    try {
      console.log(addressName);
      const addressResponse = await axios.post('https://i11b210.p.ssafy.io:4443/api/address/name', { addressName }, {
        headers: {
          'Authorization': `${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const { main_address_id } = addressResponse.data; // 백엔드에서 받은 주소의 main_address_id

      const data = {
        nickname,
        phone,
        main_address_id
      };

      const url = 'https://i11b210.p.ssafy.io:4443/sign-up'; // 서버 URL

      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${accessToken}`
        },
      });

      const headers = response.headers;
      const newAccessToken = headers['authorization'];
      const newRefreshToken = headers['authorization-refresh'];

      if (!newAccessToken || !newRefreshToken) {
        throw new Error('Authorization headers are missing');
      }

      // Zustand 스토어에 토큰 저장
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      alert('회원가입이 완료되었습니다.');
      navigate('/direct'); // 회원가입 완료 후 메인 페이지로 이동
    } catch (error) {
      console.error('Error submitting the form', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="nickname">닉네임:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">휴대전화:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            className={styles.inputField}
          />
          <button type="button" onClick={handleSendSms} className={styles.smsButton}>
            인증 코드 전송
          </button>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="verificationCode">인증 코드:</label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className={styles.inputField}
          />
          <button type="button" onClick={handleVerifyCode} className={styles.verifyButton}>
            인증 코드 확인
          </button>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="c_main_address">주소 검색:</label>
          <input
            type="text"
            id="c_main_address"
            value={addressName}
            readOnly
            className={styles.inputField}
          />
          <button type="button" id="addressSearch" onClick={() => window.findAddr()} className={styles.searchButton}>
            주소 검색
          </button>
        </div>
        <button type="submit" className={styles.submitButton}>
          회원 가입
        </button>
      </form>
    </div>
  );
};

export default SignUp;
