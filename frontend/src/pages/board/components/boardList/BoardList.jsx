import React from "react";

import BoardItem from "../boardItem/BoardItem";

import "./BoardList.css";

function BoardList({ boards, sType }) {
  return (
    <div className="board-list">
      {boards.map((board, index) => (
        <BoardItem key={index} board={board} salse={sType} />
      ))}
    </div>
  );
}

export default BoardList;
