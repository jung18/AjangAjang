import React from "react";
import { useNavigate } from "react-router-dom";
import usePageStore from "../../../../store/currentPageStore";

import styles from"./MyBoardItem.module.css";

function MyBoardItem({ board }) {
  const navigate = useNavigate();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  // 지역 정보 넘겨줘
  // 채팅 수 넘겨줘
  console.log(board);
  const formattedPrice = new Intl.NumberFormat("en-US").format(board.price);

  const handleClick = () => {
    setCurrentPage("board-detail"); // 페이지 이름을 일반적인 이름으로 변경
    navigate(`/board/${board.boardId}`); // 단일 경로로 변경
  };

  return (
    <div className={styles.boardCard} onClick={handleClick}>
      <div className={styles.boardImg}>
        <img alt="test" src="https://picsum.photos/200" />
      </div>
      <div className={styles.info}>
        <span className={styles.location}>지역 정보</span>
        <span className={styles.category}>{board.category}</span>
      </div>
      <div className={styles.title}>{board.title}</div>
      <div className={styles.secondInfo}>
        <div className={styles.price}>{formattedPrice}원</div>
      </div>
    </div>
  );
}

export default MyBoardItem;
