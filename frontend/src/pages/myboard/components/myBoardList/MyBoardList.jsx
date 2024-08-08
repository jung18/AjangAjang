import React from "react";

import MyBoardItem from "../myBoardItem/MyBoardItem";

import styles from"./MyBoardList.module.css";

function MyBoardList({ boards }) {
  return (
    <div className={styles.boardList}>
      {boards.map((board, index) => (
        <MyBoardItem key={index} board={board} />
      ))}
    </div>
  );
}

export default MyBoardList;
