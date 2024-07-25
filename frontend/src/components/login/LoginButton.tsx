import React from 'react';

type LoginButtonProps = {
  provider: 'google' | 'naver' | 'kakao';
  imageSrc: string;
  altText: string;
  redirectUrl: string;
};

const LoginButton: React.FC<LoginButtonProps> = ({ provider, imageSrc, altText, redirectUrl }) => {
  return (
    <a href={redirectUrl}>
      <img src={imageSrc} alt={altText} />
    </a>
  );
};

export default LoginButton;
