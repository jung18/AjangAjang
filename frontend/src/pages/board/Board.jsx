import React, { useEffect, useState } from "react";
import { fetchBoardList } from "../../api/boardService";

import BoardItem from "./components/boardItem/BoardItem";

import "./Board.css";

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const boardList = await fetchBoardList();
        setBoards(boardList);
      } catch (error) {
        console.error("Failed to fetch boards", error);
      } finally {
        setIsLoading(false); // 데이터 로드가 끝나면 로딩 상태를 false로 설정
      }
    };

    getBoards();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  return (
    <div className="board-page">
      <BoardItem board={boards.data[0]} />
    </div>
  );
};

export default Board;
