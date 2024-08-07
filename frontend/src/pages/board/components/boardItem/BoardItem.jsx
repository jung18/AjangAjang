import React from "react";
import { useNavigate } from "react-router-dom";
import usePageStore from "../../../../store/currentPageStore";

import LikeIcon from "../../../../assets/icons/like.png";
import ChatIcon from "../../../../assets/icons/chat.png";

import "./BoardItem.css";

function BoardItem({ board }) {
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
    <div className="board-card" onClick={handleClick}>
      <div className="board-img">
        <img alt="test" src="https://picsum.photos/200" />
      </div>
      <div className="info">
        <span className="location">지역 정보</span>
        <span className="category">{board.category}</span>
      </div>
      <div className="title">{board.title}</div>
      <div className="second-info">
        <div className="price">{formattedPrice}원</div>
        <div className="like-chat">
          <div className="like">
            <img alt="like" src={LikeIcon} />
            <div>{board.likeCount}</div>
          </div>
          <div className="chat">
            <img alt="chat" src={ChatIcon} />
            <div>0</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardItem;
