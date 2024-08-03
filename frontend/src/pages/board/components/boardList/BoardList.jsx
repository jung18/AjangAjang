import React from "react";

import BoardItem from "../boardItem/BoardItem";

import "./BoardList.css"

function BoardList({ boards }) {
  return (
    <div className="board-list">
      {boards.map((board, index) => (
        <BoardItem key={index} board={board} />
      ))}
    </div>
  );
}

export default BoardList;
