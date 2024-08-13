import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useTokenStore from "../../store/useTokenStore"; // 경로 수정
import styles from "./EditMyInfo.module.css"; // CSS 파일 import

const EditMyInfo = () => {
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false); // 초기값 false로 수정

  const navigate = useNavigate();
  const accessToken = useTokenStore((state) => state.accessToken);

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleSendSms = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/sms/send",
        { phone },
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );
      if (response.data.success) {
        alert("인증 코드가 전송되었습니다.");
      }
    } catch (error) {
      console.error("Failed to send SMS:", error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/sms/confirm",
        { phone, certificationNumber: verificationCode },
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        // 상태 코드 200 확인
        setIsVerified(true);
        alert("인증이 완료되었습니다.");
      } else {
        alert("인증 코드가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Failed to verify code:", error);
      alert("인증 코드 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert("전화번호 인증을 완료해주세요.");
      return;
    }

    const data = {
      nickname,
      phone,
    };

    const url = "http://localhost:8080/api/user/my"; // 서버 URL

    const response = await axios.put(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
    });

    const headers = response.headers;

    alert("수정 완료");
    navigate("/user/myinfo"); // 회원가입 완료 후 메인 페이지로 이동
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
          <button
            type="button"
            onClick={handleSendSms}
            className={styles.smsButton}
          >
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
          <button
            type="button"
            onClick={handleVerifyCode}
            className={styles.verifyButton}
          >
            인증 코드 확인
          </button>
        </div>
        <button type="submit" className={styles.submitButton}>
          수정 완료
        </button>
      </form>
    </div>
  );
};

export default EditMyInfo;
