import React from "react";
import { useNavigate } from "react-router-dom";

import "./BoardHeader.css";

import usePageStore from '../../store/currentPageStore';

import Logo from "../../assets/logos/logo-white.png";
import Icon from "../../assets/icons/search.png";

const BoardHeader = () => {
  const navigate = useNavigate();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  const handleBtnClick = () => {
    setCurrentPage('search');
    navigate("/search");
  };

  return (
    <header>
      <img className="logo" alt="logo" src={Logo} />
      <button className="search-btn" onClick={handleBtnClick}>
        <img className="icon" alt="icon" src={Icon} />
      </button>
    </header>
  );
};

export default BoardHeader;
