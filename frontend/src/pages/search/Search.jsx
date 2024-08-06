import React, { useContext, useState, setState } from "react";
import { SearchHistoryContext } from "../../contexts/SearchHistoryContext";

import { fetchSearchResults } from "../../api/searchService";

import SearchListIcon from "../../assets/icons/search-list.png";
import DeleteSearchItemIcon from "../../assets/icons/delete-search-item.png";

import "./Search.css";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체"); // 활성화된 탭 상태
  const [searchResults, setSearchResults] = useState([]); 
  const {
    recentSearches,
    autoSave,
    addSearchTerm,
    clearSearchHistory,
    toggleAutoSave,
    removeSearchTerm,
  } = useContext(SearchHistoryContext);
  //카테고리 목록 관리 필요

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 엔터키 제출 방지
      executeSearch();
    }
  };

  const executeSearch = async () => {
    if (searchTerm.trim()) {
      addSearchTerm(searchTerm.trim());
      try {
        const results = await fetchSearchResults(searchTerm, activeTab);
        setSearchResults(results); // 검색 결과 설정
      } catch (error) {
        console.error("검색 결과를 가져오는데 실패했습니다:", error);
      }
      setSearchTerm("");
    }
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
          onKeyPress={handleKeyPress}
          placeholder="검색어를 입력하세요."
        />
      </div>
      <div className="category-tab">
        {["전체", "유모차", "장난감", "아기옷", "카시트", "생활용품", "가구"].map((tab) => (
          <div
            key={tab}
            className={`tab-item ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="recent-search">
        <div className="recent-search-header">
          <span className="search-header-title">최근 검색</span>
          <span className="clear-options">
            <span onClick={clearSearchHistory}>전체 삭제</span>
            <span className="separator">|</span>
            <span
              onClick={toggleAutoSave}
              className={autoSave ? "auto-save-active" : ""}
            >
              {autoSave ? "자동 저장 끄기" : "자동 저장 켜기"}
            </span>
          </span>
        </div>
        {recentSearches.length === 0 ? (
          <div className="no-recent-search">최근 검색 기록이 없습니다.</div>
        ) : (
          <div className="recent-search-items-container">
            {recentSearches.map((search, index) => (
              <div key={index} className="recent-search-item">
                <div className="item-left">
                  <img alt="아이콘" src={SearchListIcon} />
                  <div className="search-term">{search}</div>
                </div>
                <img
                  alt="아이콘"
                  src={DeleteSearchItemIcon}
                  onClick={() => removeSearchTerm(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
