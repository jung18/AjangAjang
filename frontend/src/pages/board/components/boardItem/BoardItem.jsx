import React from "react";
import { useNavigate } from "react-router-dom";
import usePageStore from "../../../../store/currentPageStore";

import LikeIcon from "../../../../assets/icons/like.png";
import CameraIcon from "../../../../assets/camera.png";

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

  const getCategoryLabel = (category) => {
    switch (category) {
      case "DAILY_SUPPLIES":
        return "일상 용품";
      case "BABY_CARRIAGE":
        return "유모차";
      case "FURNITURE":
        return "아기가구";
      case "BABY_CLOTHES":
        return "아기옷";
      case "TOY":
        return "장난감";
      case "CAR_SEAT":
        return "카시트";
      default:
        return "기타";
    }
  };

  return (
    <div className="board-card" onClick={handleClick}>
      <div className="board-img">
        <img alt="test" src={board.thumbnailUrl || CameraIcon} />
      </div>
      <div className="board-content">
        <div className="category">{getCategoryLabel(board.category)}</div>
        <div className="title">{board.title}</div>
        <div className="second-info">
          <div className="price">{formattedPrice}원</div>
          <div className="like">
            <img alt="like" src={LikeIcon} />
            <div>{board.likeCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardItem;
