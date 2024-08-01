import React from "react";
import "./LoginButtons.css";
import GLogo from "../../../assets/logos/g-logo.png"
import NLogo from "../../../assets/logos/n-logo.png"
import KLogo from "../../../assets/logos/k-logo.png"

export const GoogleLoginButton = ({ redirectUrl }) => (
  <button className="login-button google" onClick={() => window.location.href = redirectUrl}>
    <img
      src={GLogo}
      alt="Google logo"
      className="logo"
    />
    <span className="button-text">구글로 로그인하기</span>
  </button>
);

export const NaverLoginButton = ({ redirectUrl }) => (
  <button className="login-button naver" onClick={() => window.location.href = redirectUrl}>
    <img
      src={NLogo}
      alt="Naver logo"
      className="logo"
    />
    <span className="button-text">네이버로 로그인하기</span>
  </button>
);

export const KakaoLoginButton = ({ redirectUrl }) => (
  <button className="login-button kakao" onClick={() => window.location.href = redirectUrl}>
    <img
      src={KLogo}
      alt="Kakao logo"
      className="logo"
    />
    <span className="button-text">카카오톡으로 로그인하기</span>
  </button>
);

export const LoginButtons = () => {
  return (
    <div className="login-buttons">
      <GoogleLoginButton redirectUrl="http://localhost:8080/oauth2/authorization/google" />
      <NaverLoginButton redirectUrl="http://localhost:8080/oauth2/authorization/naver" />
      <KakaoLoginButton redirectUrl="http://localhost:8080/oauth2/authorization/kakao" />
    </div>
  );
};
