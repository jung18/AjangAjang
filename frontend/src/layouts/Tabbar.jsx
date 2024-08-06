import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import usePageStore from '../store/currentPageStore';

import IconButton from "../components/IconButton";

import locationIcon from "../assets/icons/location.png";
import boxIcon from "../assets/icons/box.png";
import postIcon from "../assets/icons/post.png";
import sentIcon from "../assets/icons/sent.png";
import userIcon from "../assets/icons/account.png";

import ActiveLocationIcon from "../assets/icons/location-active.png";
import ActiveBoxIcon from "../assets/icons/box-active.png";
import ActivePostIcon from "../assets/icons/post-active.png";
import ActiveSentIcon from "../assets/icons/sent-active.png";
import ActiveUserIcon from "../assets/icons/account-active.png";
import "./Tabbar.css";

const Tabbar = () => {
  const navigate = useNavigate();
  const { currentPage, setCurrentPage } = usePageStore((state) => ({
    currentPage: state.currentPage,
    setCurrentPage: state.setCurrentPage,
  }));

  useEffect(() => {
    switch (currentPage) {
      case "/direct":
        navigate("/direct");
        break;
      case "/parcel":
        navigate("/parcel");
        break;
      case "/post":
        navigate("/post");
        break;
      case "/chat":
        navigate("/chat");
        break;
      case "/user":
        navigate("/user");
        break;
      default:
        break;
    }
  }, [currentPage, navigate]);

  const setActiveTab = (tab) => {
    setCurrentPage(tab);
  };

  return (
    <div className="tabbar">
      <div className="btns">
        <IconButton className="icon-btn"
          activeIcon={ActiveLocationIcon}
          inactiveIcon={locationIcon}
          label="직접거래"
          showText={true}
          isActive={currentPage.startsWith("/direct")}
          click={() => setActiveTab("/direct")}
        />
        <IconButton className="icon-btn"
          activeIcon={ActiveBoxIcon}
          inactiveIcon={boxIcon}
          label="택배거래"
          showText={true}
          isActive={currentPage.startsWith("/parcel")}
          click={() => setActiveTab("/parcel")}
        />
        <IconButton className="icon-btn"
          activeIcon={ActivePostIcon}
          inactiveIcon={postIcon}
          label="글 작성"
          showText={true}
          isActive={currentPage.startsWith("/post")}
          click={() => setActiveTab("/post")}
        />
        <IconButton className="icon-btn"
          activeIcon={ActiveSentIcon}
          inactiveIcon={sentIcon}
          label="채팅하기"
          showText={true}
          isActive={currentPage.startsWith("/chat")}
          click={() => setActiveTab("/chat")}
        />
        <IconButton className="icon-btn"
          activeIcon={ActiveUserIcon}
          inactiveIcon={userIcon}
          label="내 정보"
          showText={true}
          isActive={currentPage.startsWith("/user")}
          click={() => setActiveTab("/user")}
        />
      </div>
    </div>
  );
};

export default Tabbar;
