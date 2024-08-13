import React from "react";
import "./MyInfo.css";
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
      </div>
    </div>
  );
}

export default MyInfo;
