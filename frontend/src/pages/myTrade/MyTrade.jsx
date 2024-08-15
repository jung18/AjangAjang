import React, { useState, useEffect } from "react";

import { fetchTradeList } from "../../api/tradeService";
import apiClient from "../../api/apiClient";

import "./MyTrade.css";
import BoardItem from "../board/components/boardItem/BoardItem";

import Modal from "../../components/Modal";
import CloseIcon from "../../assets/icons/close.png";
import useTokenStore from "../../store/useTokenStore";

const dummy = [
  {
    board: {
      boardId: 20,
      thumbnailUrl: "",
      writer: {
        userId: 3,
        nickname: "연동1",
        profileImage:
          "https://ajangajangbucket.s3.ap-northeast-2.amazonaws.com/15e5e2ba-ba34-454e-8975-cdabc2f50f30_%ED%9E%9D.png",
        level: "범죄자",
      },
      title: "연금은동",
      price: 888,
      address: "유성구봉명동",
      category: "ETC",
      status: "SOLD_OUT",
      likeCount: 0,
      viewCount: 14,
    },
    tradeId: 1,
  },
];

function MyTrade() {
  const [sellList, setSellList] = useState([]);
  const [buyList, setBuyList] = useState([]);
  const [maxHeight, setMaxHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("구매 내역"); // 활성화된 탭 상태
  const [activeList, setActiveList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [reviewContent, setReviewContent] = useState(""); // 리뷰 내용 상태
  const [rating, setRating] = useState(0); // 점수 상태

  const fetchData = async () => {
    try {
      // const response = await fetchTradeList();
      // console.log(response);
      // setBuyList(response.buyingTrades);
      // setSellList(response.sellingTrades);
      // setActiveList(response.buyingTrades);
      setBuyList(dummy);
      setActiveList(dummy);
    } catch (error) {
      console.error("Failed to fetch trade list:", error);
    } finally {
      setIsLoading(false); // 데이터 로드가 완료되었을 때 로딩 상태 해제
    }
  };

  useEffect(() => {
    fetchData();

    const calculateMaxHeight = () => {
      const totalHeight = window.innerHeight;
      setMaxHeight(totalHeight - 280);
    };

    calculateMaxHeight();
    window.addEventListener("resize", calculateMaxHeight);

    return () => {
      window.removeEventListener("resize", calculateMaxHeight);
    };
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab); // 클릭한 탭으로 활성 탭 변경
    if (tab === "구매 내역") setActiveList(buyList);
    else setActiveList(sellList);
    // 추가적으로 탭 클릭 시 필터링 로직을 구현할 수 있음
  };

  const handleBuyItemClick = (board) => {
    console.log("구매 내역에서 클릭된 아이템:", board);
    setSelectedBoard(board);
    setModalOpen(true);
    // 원하는 로직을 여기서 추가할 수 있습니다.
  };

  const report = () => {
    console.log("리뷰 내용:", reviewContent);
    console.log("점수:", rating);
    // 이곳에 실제 제출 로직을 구현합니다.
    const review = {
      tradeId: selectedBoard.tradeId,
      score: rating,
      content: reviewContent,
    };
    createReview(review);
    closeModal();
  };

  const createReview = async (review) => {
    console.log(review);
    // try {
    //   const { accessToken } = useTokenStore.getState();
    //   console.log(accessToken);

    //   const url = "https://i11b210.p.ssafy.io:4443/api/review";
    //   //거래 유형 별로 해당되는 유형의 게시글만 넘겨주도록 서버 코드 수정 필요

    //   const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //       Authorization: `${accessToken}`,
    //     },
    //     credentials: "include",
    //     body: review,
    //   });

    //   const data = await response.json();
    //   return data;
    // } catch (error) {
    //   console.error("Error fetching board detail", error);
    //   throw error;
    // }
    try {
      await apiClient.post("/api/board/recommendation", {
        tradeId: review.tradeId,
        score: review.score,
        content: review.content,
      });
    } catch (error) {
      console.error("Error fetching board detail", error);
      throw error;
    }
  };

  const closeModal = () => {
    setModalOpen(false); // 모달 창 닫기
    setSelectedBoard(null); // 선택된 항목 초기화
    setReviewContent(""); // 리뷰 내용 초기화
    setRating(0); // 점수 초기화
  };

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  return (
    <div>
      <div className="boardTitle">거래 내역</div>
      <div className="category-tab">
        {["구매 내역", "판매 내역"].map((tab) => (
          <div
            key={tab}
            className={`tab-item ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="boardPage" style={{ maxHeight: `${maxHeight}px` }}>
        {activeList.length === 0 ? (
          <div className="notFoundContent">
            {activeTab === "구매 내역"
              ? "구매 내역이 존재하지 않습니다."
              : "판매 내역이 존재하지 않습니다."}
          </div>
        ) : (
          <div className="trade-list">
            {activeList.map((board, idx) => (
              <div className="trade-item">
                <div className="clickable-div" key={idx}>
                  <BoardItem board={board.board} />
                </div>
                <button
                  type="button"
                  onClick={
                    activeTab === "구매 내역"
                      ? () => handleBuyItemClick(board)
                      : null
                  }
                >
                  리뷰하기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {modalOpen && (
        <Modal onClose={closeModal}>
          <div className="modal-close-btn">
            <button onClick={closeModal}>
              <img alt="close-icon" src={CloseIcon} />
            </button>
          </div>
          <div className="modal-title">리뷰하기</div>
          <div className="rating-section">
            <label>점수 선택: </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <textarea
            className="report-content"
            type="text"
            placeholder="리뷰 내용을 작성해주세요."
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
          <button className="report-btn" onClick={report}>
            확인
          </button>
        </Modal>
      )}
    </div>
  );
}

export default MyTrade;
