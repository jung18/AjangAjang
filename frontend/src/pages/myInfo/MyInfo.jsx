import React from "react";
import styles from"./MyInfo.module.css";
import usePageStore from "../../store/currentPageStore";
import { useNavigate } from 'react-router-dom';

function MyInfo() {
  const navigate = useNavigate();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  return (
      <div className={styles.myPage}>
        <div className={styles.profile}>
          <div className={styles.profileImage}>
            <img src="https://via.placeholder.com/100" alt="Profile" />
          </div>
          <div className={styles.profileInfo}>
            <h4>닉네임</h4>
            <p>레벨</p>
          </div>
        </div>
        <div>
          <p>닉네임</p>
          <p>핸드폰</p>
        </div>
      </div>
    );
}

export default MyInfo;