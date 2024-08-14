import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { deleteMyBoard } from "../../api/boardService";
import { fetchBoardDetail } from "../../api/boardDetailService";
import useStore from "../../store/store";
import useUserStore from "../../store/useUserStore"; // useUserStore 가져오기
import usePageStore from "../../store/currentPageStore";

import LikeIcon from "../../assets/icons/like-inactive.png";
import LikeActiveIcon from "../../assets/icons/like-active.png";
import VideoIcon from "../../assets/icons/video.png";
import CloseIcon from "../../assets/icons/close.png";

import "./BoardDetetail.css";

function BoardDetail() {
  const { id } = useParams(); // URL 경로에서 boardId를 가져옴
  const [boardDetail, setBoardDetail] = useState(null); // Board 상세 정보를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const likedBoards = useStore((state) => state.likedBoards);
  const toggleLike = useStore((state) => state.toggleLike);
  const [formattedPrice, setFormattedPrice] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  
  const handleEditButtonClick = () => {
    usePageStore.getState().setCurrentPage(`/board/${id}`); // 현재 페이지 정보 저장
    navigate(`/edit/${id}`, { state: { boardDetail: boardDetail } }); // 수정 페이지로 이동
  };

  const handleDeleteButtonClick = () => {
    deleteMyBoard(id);
  };

  useEffect(() => {
    // 데이터를 가져오는 비동기 함수
    const getBoardDetail = async () => {
      try {
        const data = await fetchBoardDetail(id); // id를 사용해 fetchBoardList 호출
        console.dir(data);
        setBoardDetail(data);
        setFormattedPrice(new Intl.NumberFormat("en-US").format(data.price));
      } catch (error) {
        console.error("Failed to fetch board details:", error);
      } finally {
        setLoading(false);
      }
    };

    getBoardDetail();
  }, [id]); // boardId가 변경될 때마다 useEffect 재실행

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  if (!boardDetail) {
    return (
      <div className="board-detail-page">
        <div className="not-found-content">게시글이 존재하지 않습니다.</div>
      </div> // boardDetail이 null일 경우
    );
  }

  const isLiked = likedBoards[id] || false;

  const videoBtnClickHandler = () => {
    // 예시로 사용한 비디오 URL, 실제로는 API에서 가져온다거나 하는 방법으로 설정
    const url =
      boardDetail.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"; // videoUrl은 백엔드에서 받아온 비디오 URL

    if (!url) {
      alert("영상이 존재하지 않습니다.");
      return;
    }

    setVideoUrl(url);
    setIsVideoPlaying(true);
  };

  const handleChatButtonClick = () => {
    // 채팅 기능 구현
    alert("채팅 시작");
  };

  return (
    <div className="board-detail-page">
      <img alt="board-img" src="https://picsum.photos/200" />
      <div className="img-btns">
        <img
          className="like-btn"
          alt="like"
          src={isLiked ? LikeActiveIcon : LikeIcon}
          onClick={() => toggleLike(id)}
        />
        <img
          className="video-btn"
          alt="video"
          src={VideoIcon}
          onClick={videoBtnClickHandler}
        />
      </div>
      <div className="profile-bar">
        <div className="writer-profile">
          <img alt="작성자 프로필" src="https://picsum.photos/200" />
          <div className="writer-info">
            <div className="writer-name">{boardDetail.writer.nickname}</div>
            <div className="other-info">
              <span className="level">레벨 정보</span>
              <span>지역</span>
            </div>
          </div>
        </div>
        {user?.id === boardDetail.writer.id ? (
          <div className="btns">
            <button className="edit-btn" onClick={handleEditButtonClick}>
              수정
            </button>
            <button className="delete-btn" onClick={handleDeleteButtonClick}>
              삭제
            </button>
          </div>
        ) : (
          <button className="chat-btn" onClick={handleChatButtonClick}>
            채팅
          </button>
        )}
      </div>
      <div className="post-content">
        <div className="post-content-info">
          <div className="info-left">
            <div className="post-title">{boardDetail.title}</div>
            <div className="post-other-info">
              <span className="post-category">{boardDetail.category}</span>
              <span>작성 시각</span>
            </div>
          </div>
          <div className="post-price">{formattedPrice}원</div>
        </div>
        <div className="post-main-content">{boardDetail.content}</div>
        <div className="post-last-info">
          <span>관심 {boardDetail.likeCount}</span>
          <span>채팅 수</span>
          <span>조회 수</span>
        </div>
      </div>

      {/* 비디오 재생 모달 */}
      {isVideoPlaying && (
        <div className="video-modal">
          <button
            className="close-btn"
            onClick={() => setIsVideoPlaying(false)}
          >
            <img alt="close icon" src={CloseIcon} />
          </button>
          <div className="video-container">
            <video controls autoPlay width="100%">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardDetail;
