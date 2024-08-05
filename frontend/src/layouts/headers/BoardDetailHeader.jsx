import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./BoardDetailHeader.css";

import BackIcon from "../../assets/icons/back.png";
import MenuIcon from "../../assets/icons/menu.png";

function BoardDetailHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBackBtnClick = () => {
    navigate(-1);
  };

  const handleMenuBtnClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest(".menu")) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

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
      <div className="menu">
        <button className="menu-btn">
          <img
            className="icon"
            alt="icon"
            src={MenuIcon}
            onClick={handleMenuBtnClick}
          />
        </button>
        {isMenuOpen && (
          <div className="menu-option">
            <div>공유하기</div>
            <div>신고하기</div>
          </div>
        )}
      </div>
    </header>
  );
}

export default BoardDetailHeader;
