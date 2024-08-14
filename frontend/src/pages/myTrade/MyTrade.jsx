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
  const [activeList, setActiveList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetchTradeList();
      console.log(response);
      setBuyList(response.buyingTrades);
      setSellList(response.sellingTrades);
      setActiveList(response.buyingTrades);
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
            <BoardList boards={activeList} />
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrade;
