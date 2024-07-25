import React from 'react';
import SocialLoginButton from '../components/login/LoginButton';
import googleLoginImage from '../assets/google-login.png';
import naverLoginImage from '../assets/naver-login.png';
import kakaoLoginImage from '../assets/kakao-login.png';

const Login: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>처음에 여기</h2>
      <SocialLoginButton 
        provider="google" 
        imageSrc={googleLoginImage}  // 절대 경로 사용
        altText="Google Login" 
        redirectUrl="http://localhost:8080/oauth2/authorization/google" 
      />
      <SocialLoginButton 
        provider="naver" 
        imageSrc={naverLoginImage}  // 절대 경로 사용
        altText="Naver Login" 
        redirectUrl="http://localhost:8080/oauth2/authorization/naver" 
      />
      <SocialLoginButton 
        provider="kakao" 
        imageSrc={kakaoLoginImage}  // 절대 경로 사용
        altText="Kakao Login" 
        redirectUrl="http://localhost:8080/oauth2/authorization/kakao" 
      />
    </div>
  );
};

export default Login;
