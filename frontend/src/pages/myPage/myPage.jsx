import React, { useContext, useState, setState } from "react";
import styles from"./myPage.module.css";
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logos/logo.png';

function MyPage() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    if (path) {
      navigate(path);
    } 
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
            <div className={styles.menuItem} onClick={() => handleNavigation('/user/boards')}>내 작성글</div>
            <div className={styles.menuItem}>리뷰목록</div>
          </container>
          <container className={styles.menuitemcontainer}>
            <div className={styles.menuItem}>찜한목록</div>
            <div className={styles.menuItem}>거래내역</div>
          </container>
          <container className={styles.menuitemcontainer}>
            <div className={styles.myInfo}>회원정보 수정</div>
          </container>
        </div>
      </div>
    );
}

export default MyPage;