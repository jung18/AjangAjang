import React, { useContext, useState, setState } from "react";
import styles from"./myPage.module.css";
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const navigate = useNavigate();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  const handleClickBoard = () => {
    setCurrentPage("my-boards");
    navigate(`/user/boards`); 
  };
  const handleClickReview = () => {
    setCurrentPage("my-reviews");
    navigate(`/user/reviews`); 
  };
  const handleClickLike = () => {
    setCurrentPage("my-likes");
    navigate(`/user/likes`); 
  };
  const handleClickTrade = () => {
    setCurrentPage("my-trades");
    navigate(`/user/trades`);
  };
  const handleClickMyInfo = () => {
    setCurrentPage("my-info");
    navigate(`/user/myinfo`);
  };
 
  return (
      <div className={styles.myPage}>
        <div className={styles.profile}>
          <div className={styles.profileImage}>
            <img src="https://via.placeholder.com/100" alt="Profile" />
          </div>
          </div>
          <div className={styles.profileInfo}>
            <h4>닉네임</h4>
            <p>레벨</p>
        </div>
        <div className={styles.menu}>
          <container className={styles.menuitemcontainer}>
            <div className={styles.menuItem} onClick={handleClickBoard}>내 작성글</div>
            <div className={styles.menuItem} onClick={handleClickReview}>리뷰목록</div>
          </container>
          <container className={styles.menuitemcontainer}>
            <div className={styles.menuItem} onClick={handleClickLike}>찜한목록</div>
            <div className={styles.menuItem} onClick={handleClickTrade}>거래내역</div>
          </container>
          <container className={styles.menuitemcontainer}>
            <div className={styles.myInfo} onClick={handleClickMyInfo}>회원정보 수정</div>
          </container>
        </div>
      </div>
    );
}

export default MyPage;