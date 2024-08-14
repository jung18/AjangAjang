import React, { useContext, useState, useEffect } from "react";
import { SearchHistoryContext } from "../../contexts/SearchHistoryContext";

import { fetchSearchResults } from "../../api/searchService";

import SearchListIcon from "../../assets/icons/search-list.png";
import DeleteSearchItemIcon from "../../assets/icons/delete-search-item.png";

import BoardList from "../board/components/boardList/BoardList";

import "./Search.css";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("전체"); // 활성화된 탭 상태
  const [searchResults, setSearchResults] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [changedTerm, setChangedTerm] = useState("");
  const [originalTerm, setOriginalTerm] = useState("");
  const [maxHeight, setMaxHeight] = useState(0); // maxHeight 상태 추가
  const [maxHeight2, setMaxHeight2] = useState(0);

  const {
    recentSearches,
    autoSave,
    addSearchTerm,
    clearSearchHistory,
    toggleAutoSave,
    removeSearchTerm,
  } = useContext(SearchHistoryContext);

  // 더미 데이터 생성
  const dummyData = [
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
  ];

  // max-height 계산
  useEffect(() => {
    const calculateMaxHeight = () => {
      const headerHeight = 434; // 예상되는 헤더 높이
      const viewportHeight = window.innerHeight;
      const calculatedMaxHeight = viewportHeight - headerHeight;
      setMaxHeight(calculatedMaxHeight);

      const footerHeight = 354; // 예상되는 푸터 높이
      const calculatedMaxHeight2 = viewportHeight - footerHeight;
      setMaxHeight2(calculatedMaxHeight2);
    };

    calculateMaxHeight();
    window.addEventListener("resize", calculateMaxHeight);

    return () => {
      window.removeEventListener("resize", calculateMaxHeight);
    };
  }, []);

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
        const results = await fetchSearchResults(searchTerm, activeTab, false);

        setSearchResults(results.searchResult); // 검색 결과 설정
        setIsChanged(results.changed);

        if (results.changed) {
          setChangedTerm(results.suggestedTitle);
        }

        setOriginalTerm(results.originalTitle);
      } catch (error) {
        console.error("검색 결과를 가져오는데 실패했습니다:", error);
      }
      setSearchTerm("");
    }
  };

  const handleResearch = async () => {
    try {
      const results = await fetchSearchResults(originalTerm, activeTab, true);

      setSearchResults(results.searchResult); // 검색 결과 설정

      console.log(searchResults);

      setIsChanged(results.changed);

      if (results.changed) {
        setChangedTerm(results.suggestedTitle);
      }

      setOriginalTerm(results.originalTitle);
    } catch (error) {
      console.error("검색 결과를 가져오는데 실패했습니다:", error);
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
        {[
          "전체",
          "유모차",
          "장난감",
          "아기옷",
          "카시트",
          "생활용품",
          "가구",
        ].map((tab) => (
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
        {searchResults.length !== 0 ? (
          <>
            {isChanged && (
              <div className="recommend-search">
                <div className="changed-search">
                  <div className="changed-term">{changedTerm}</div>
                  <div className="changed-text">로 검색</div>
                </div>
                <div className="original-search" onClick={handleResearch}>
                  <div className="original-term">{originalTerm}</div>
                  <div className="original-text">로 다시 검색</div>
                </div>
              </div>
            )}
            {dummyData.length === 0 ? (
              //searchResults.content.length === 0
              <div className="no-search-result">검색 결과가 없습니다.</div>
            ) : (
              /*<BoardList boards={searchResults.content} />*/
              <div
                className="search-result-list"
                style={{ maxHeight: `${maxHeight2}px` }}
              >
                <BoardList boards={dummyData} />
              </div>
            )}
          </>
        ) : (
          <div className="recent-search-items">
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
              <div
                className="recent-search-items-container"
                style={{ maxHeight: `${maxHeight}px` }}
              >
                {recentSearches
                  .slice()
                  .reverse()
                  .map((search, index, array) => (
                    <div key={index} className="recent-search-item">
                      <div className="item-left">
                        <img alt="아이콘" src={SearchListIcon} />
                        <div className="search-term">{search}</div>
                      </div>
                      <img
                        alt="아이콘"
                        src={DeleteSearchItemIcon}
                        onClick={() =>
                          removeSearchTerm(array.length - 1 - index)
                        }
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
