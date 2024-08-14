import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import BoardList from "../board/components/boardList/BoardList"; // BoardList와 동일한 컴포넌트 사용
import styles from "./MyBoard.module.css";

const MyBoard = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const response = await apiClient.get("/api/user/my/boards"); // 내 게시글 API 호출
        const boardList = response.data.data || []; // 명세서에 따른 데이터 구조 반영
        console.log("Fetched boards:", boardList); // 데이터가 제대로 들어오는지 확인
        setBoards(boardList);
      } catch (error) {
        console.error("Failed to fetch my boards", error);
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
    <div>
      <div className={styles.boardTitle}>내 게시글</div>
      <div className={styles.boardPage}>
        {!boards || boards.length === 0 ? (
          <div className={styles.notFoundContent}>내 게시글이 존재하지 않습니다.</div>
        ) : (
          <BoardList boards={boards} />
        )}
      </div>
    </div>
  );
};

export default MyBoard;





