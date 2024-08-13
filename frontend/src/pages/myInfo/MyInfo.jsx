import React from "react";

import "./MyInfo.css";
import AddIcon from "../../assets/icons/add.png";
import DeleteIcon from "../../assets/icons/close.png";

import usePageStore from "../../store/currentPageStore";

import { useNavigate } from "react-router-dom";

function MyInfo() {
  const navigate = useNavigate();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  const editBtnClickHandler = () => {
    setCurrentPage("/user/myinfo");
    navigate("/user/myinfo/edit");
  };

  return (
    <div>
      <div className="board-title">내 정보</div>
      <div className="myPage">
        <div className="page-top">
          <div className="profile">
            <img src="https://via.placeholder.com/100" alt="Profile" />
            <div className="profile-info">
              <div className="profile-info-top">
                <div className="profile-nickname">닉네임</div>
                <div className="profile-level">레벨 0</div>
              </div>
              <div>010-1111-1111</div>
            </div>
          </div>
          <button onClick={editBtnClickHandler} type="button">
            수정
          </button>
        </div>
        <div className="address">
          <div className="address-header">
            <div className="address-title">주소 목록</div>
            <div className="address-btns">
              <div className="change-rep">대표변경</div>
              <img src={AddIcon} alt="icon" className="add-address" />
            </div>
          </div>
          <div className="address-list">
            <div className="address-item">
              <div className="address-content">서울시 양천구 목동동로 130</div>
              <div className="address-item-btns">
                <div className="address-type-set">범위설정</div>
                <img alt="icon" src={DeleteIcon} />
              </div>
            </div>
            <div className="address-item">
              <div className="address-content">서울시 양천구 목동동로 130</div>
              <div className="address-item-btns">
                <div className="address-type-set">범위설정</div>
                <img alt="icon" src={DeleteIcon} />
              </div>
            </div>
          </div>
        </div>
        <div className="children">
          <div className="children-header">
            <div className="children-title">아이 목록</div>
            <div className="children-btns">
              <div className="change-rep">대표변경</div>
              <img src={AddIcon} alt="icon" className="add-children" />
            </div>
          </div>
          <div className="children-list">
            <div className="children-item">
              <div className="children-content">아이1 / 여자 / 2024-08-01</div>
              <img alt="icon" src={DeleteIcon} />
            </div>
            <div className="children-item">
              <div className="children-content">아이2 / 여자 / 2024-08-01</div>
              <img alt="icon" src={DeleteIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;
