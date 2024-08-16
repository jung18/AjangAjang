import React from "react";

import "./BoardHeader.css";

import Logo from "../../assets/logos/logo-white.png";

const PostHeader = () => {
  return (
    <header>
      <img className="logo" alt="logo" src={Logo} />
    </header>
  );
};

export default PostHeader;
