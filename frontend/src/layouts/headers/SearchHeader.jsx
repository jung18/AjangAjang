import React from "react";
import { useNavigate } from "react-router-dom";

import "./BoardDetailHeader.css";

import BackIcon from "../../assets/icons/back.png";

function SearchHeader() {
  const navigate = useNavigate();

  const handleBackBtnClick = () => {
    /*if (isInitialized) {
      navigate(-1);
    }*/
    navigate(-1);
  };

  return (
    <header>
      <button className="back-btn">
        <img
          className="icon"
          alt="icon"
          src={BackIcon}
          onClick={handleBackBtnClick}
        />
      </button>
    </header>
  );
}

export default SearchHeader;
