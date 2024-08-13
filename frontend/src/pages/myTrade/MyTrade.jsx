import React, { useState, useEffect } from "react";

import { fetchTradeList } from "../../api/tradeService";

import "./MyTrade.css";
import BoardList from "../board/components/boardList/BoardList";

function MyTrade() {
  const [sellList, setSellList] = useState([]);
  const [buyList, setBuyList] = useState([]);
  const [maxHeight, setMaxHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("구매 내역"); // 활성화된 탭 상태

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchTradeList();
      //setBuyList(response.data.buyingTrades);
      //setSellList(response.data.sellingTrades);

      setBuyList([
        {
          boardId: 1,
          thumbnailUrl: "https://example.com/image1.jpg",
          writer: {
            userId: 101,
            username: "user1",
            profileImage: "https://example.com/user1.jpg",
          },
          title: "Awesome Baby Stroller",
          price: 100000,
          category: "유모차",
          status: "AVAILABLE",
          likeCount: 10,
          viewCount: 100,
        },
        {
          boardId: 2,
          thumbnailUrl: "https://example.com/image2.jpg",
          writer: {
            userId: 102,
            username: "user2",
            profileImage: "https://example.com/user2.jpg",
          },
          title: "Baby Car Seat - Like New",
          price: 50000,
          category: "카시트",
          status: "SOLD",
          likeCount: 5,
          viewCount: 50,
        },
        {
          boardId: 3,
          thumbnailUrl: "https://example.com/image3.jpg",
          writer: {
            userId: 103,
            username: "user3",
            profileImage: "https://example.com/user3.jpg",
          },
          title: "Gently Used Baby Clothes",
          price: 30000,
          category: "아기옷",
          status: "AVAILABLE",
          likeCount: 8,
          viewCount: 80,
        },
        {
          boardId: 4,
          thumbnailUrl: "https://example.com/image1.jpg",
          writer: {
            userId: 101,
            username: "user1",
            profileImage: "https://example.com/user1.jpg",
          },
          title: "Awesome Baby Stroller",
          price: 100000,
          category: "유모차",
          status: "AVAILABLE",
          likeCount: 10,
          viewCount: 100,
        },
        {
          boardId: 5,
          thumbnailUrl: "https://example.com/image2.jpg",
          writer: {
            userId: 102,
            username: "user2",
            profileImage: "https://example.com/user2.jpg",
          },
          title: "Baby Car Seat - Like New",
          price: 50000,
          category: "카시트",
          status: "SOLD",
          likeCount: 5,
          viewCount: 50,
        },
        {
          boardId: 6,
          thumbnailUrl: "https://example.com/image3.jpg",
          writer: {
            userId: 103,
            username: "user3",
            profileImage: "https://example.com/user3.jpg",
          },
          title: "Gently Used Baby Clothes",
          price: 30000,
          category: "아기옷",
          status: "AVAILABLE",
          likeCount: 8,
          viewCount: 80,
        },
      ]);

      setSellList([
        {
          boardId: 1,
          thumbnailUrl: "https://example.com/image1.jpg",
          writer: {
            userId: 101,
            username: "user1",
            profileImage: "https://example.com/user1.jpg",
          },
          title: "Awesome Baby Stroller",
          price: 100000,
          category: "유모차",
          status: "AVAILABLE",
          likeCount: 10,
          viewCount: 100,
        },
        {
          boardId: 2,
          thumbnailUrl: "https://example.com/image2.jpg",
          writer: {
            userId: 102,
            username: "user2",
            profileImage: "https://example.com/user2.jpg",
          },
          title: "asdfasdf",
          price: 50000,
          category: "카시트",
          status: "SOLD",
          likeCount: 5,
          viewCount: 50,
        },
        {
          boardId: 3,
          thumbnailUrl: "https://example.com/image3.jpg",
          writer: {
            userId: 103,
            username: "user3",
            profileImage: "https://example.com/user3.jpg",
          },
          title: "Gently Used Baby Clothes",
          price: 30000,
          category: "아기옷",
          status: "AVAILABLE",
          likeCount: 8,
          viewCount: 80,
        },
        {
          boardId: 4,
          thumbnailUrl: "https://example.com/image1.jpg",
          writer: {
            userId: 101,
            username: "user1",
            profileImage: "https://example.com/user1.jpg",
          },
          title: "Awesome Baby Stroller",
          price: 100000,
          category: "유모차",
          status: "AVAILABLE",
          likeCount: 10,
          viewCount: 100,
        },
        {
          boardId: 5,
          thumbnailUrl: "https://example.com/image2.jpg",
          writer: {
            userId: 102,
            username: "user2",
            profileImage: "https://example.com/user2.jpg",
          },
          title: "Baby Car Seat - Like New",
          price: 50000,
          category: "카시트",
          status: "SOLD",
          likeCount: 5,
          viewCount: 50,
        },
        {
          boardId: 6,
          thumbnailUrl: "https://example.com/image3.jpg",
          writer: {
            userId: 103,
            username: "user3",
            profileImage: "https://example.com/user3.jpg",
          },
          title: "Gently Used Baby Clothes",
          price: 30000,
          category: "아기옷",
          status: "AVAILABLE",
          likeCount: 8,
          viewCount: 80,
        },
      ]);

      setIsLoading(false);
    };

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
    // 추가적으로 탭 클릭 시 필터링 로직을 구현할 수 있음
  };

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  const activeList = activeTab === "구매 내역" ? buyList : sellList;

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
            <BoardList boards={activeList} />
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrade;
