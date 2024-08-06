import React, { useState } from "react";

import "./Search.css";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체"); // 활성화된 탭 상태

  //카테고리 목록 관리 필요

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab); // 클릭한 탭으로 활성 탭 변경
    // 추가적으로 탭 클릭 시 필터링 로직을 구현할 수 있음
  };

  return (
    <div className="search-page">
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="검색어를 입력하세요."
        />
      </div>
      <div className="category-tab">
        {["전체", "유모차", "장난감", "기타"].map((tab) => (
          <div
            key={tab}
            className={`tab-item ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="recent-search-header">
        <span className="search-header-title">최근 검색</span>
        <span className="clear-options">
          <span>전체 삭제</span>
          <span className="separator">|</span>
          <span>자동 저장 끄기</span>
        </span>
      </div>
      <div className="recent-search">
        <div className="no-recent-search">최근 검색 기록이 없습니다.</div>
      </div>
    </div>
  );
}

export default Search;
