import React, { useEffect, useState, useRef } from "react";
import { fetchBoardList } from "../../api/boardService";
import { updateAddressRep } from "../../api/myInfoService";

import useTokenStore from "../../store/useTokenStore";
import useUserStore from "../../store/useUserStore";
import apiClient from "../../api/apiClient";
import BoardList from "./components/boardList/BoardList";
import "./Board.css";

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [combinedAddressList, setCombinedAddressList] = useState([]);
  const [repAddressIdx, setRepAddressIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [maxHeight, setMaxHeight] = useState(0);
  const [autoRecommend, setAutoRecommend] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const observer = useRef();
  const listRef = useRef(null);

  const setAccessToken = useTokenStore((state) => state.setAccessToken);
  const setRefreshToken = useTokenStore((state) => state.setRefreshToken);
  const accessToken = useTokenStore((state) => state.accessToken);
  const refreshToken = useTokenStore((state) => state.refreshToken);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // 스크롤 위치 저장 함수
  const saveScrollPosition = () => {
    localStorage.setItem("scrollPosition", window.scrollY);
  };

  // 스크롤 위치 복원 함수
  const restoreScrollPosition = () => {
    const savedPosition = localStorage.getItem("scrollPosition");
    if (savedPosition) {
      window.scrollTo(0, parseFloat(savedPosition));
    }
  };

  const getBoards = async (page = 0) => {
    try {
      if (isFetching) return;

      setIsFetching(true);
      setIsLoading(true);

      const boardList = await fetchBoardList(page);
      setBoards((prevBoards) => [
        ...prevBoards,
        ...(boardList.searchResult.content || []),
      ]);

      const repIndex = (boardList.addressList || []).findIndex(
        (address) => address.rep === true
      );
      setRepAddressIdx(repIndex);

      setAddressList(boardList.addressList);

      const combinedAddresses = (boardList.addressList || []).map((address) => {
        return address.fullAddress;
      });

      setCombinedAddressList(combinedAddresses);

      setHasMore(boardList.searchResult.totalPages > page + 1);
    } catch (error) {
      console.error("Failed to fetch boards", error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  const calculateMaxHeight = () => {
    const totalHeight = window.innerHeight;
    setMaxHeight(totalHeight - 170);
  };

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get(
        "https://i11b210.p.ssafy.io:4443/api/user/my"
      );
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  useEffect(() => {
    restoreScrollPosition();
    getBoards();
    calculateMaxHeight();
    window.addEventListener("resize", calculateMaxHeight);
    window.addEventListener("scroll", saveScrollPosition); // 스크롤 이벤트 리스너 추가

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const accessTokenFromCookie = getCookie("Authorization");
    const refreshTokenFromCookie = getCookie("Authorization-refresh");

    if (accessTokenFromCookie && !accessToken) {
      setAccessToken(accessTokenFromCookie);
    }
    if (refreshTokenFromCookie && !refreshToken) {
      setRefreshToken(refreshTokenFromCookie);
    }

    if (!user) {
      fetchUserData();
    }

    return () => {
      window.removeEventListener("resize", calculateMaxHeight);
      window.removeEventListener("scroll", saveScrollPosition); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, [
    setAccessToken,
    setRefreshToken,
    accessToken,
    refreshToken,
    user,
    setUser,
  ]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const callback = (entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetching) {
        const listHeightBeforeLoad = listRef.current.scrollHeight;
        const scrollOffset = listRef.current.scrollTop;

        setPage((prevPage) => prevPage + 1);
        getBoards(page + 1).then(() => {
          listRef.current.scrollTop =
            scrollOffset +
            (listRef.current.scrollHeight - listHeightBeforeLoad);
        });
      }
    };

    observer.current = new IntersectionObserver(callback);
    if (observer.current && boards.length > 0) {
      observer.current.observe(document.querySelector(".last-item"));
    }

    return () => observer.current.disconnect();
  }, [hasMore, boards, isFetching]);

  const handleChange = (e) => {
    const id = addressList[e.target.value].addressId;
    updateAddressRep(id);
    setRepAddressIdx(e.target.value);
    window.location.reload();
  };

  const handleAutoRecommendChange = async (event) => {
    setAutoRecommend(event.target.checked);
    if (event.target.checked) {
      try {
        const response = await apiClient.post("/api/board/recommendation", {
          page: 0,
          size: 10,
        });

        const recommendedBoards = response.data.searchResult.content;
        setBoards(recommendedBoards || []);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("추천 게시판을 불러올 수 없습니다.");
          setAutoRecommend(false);
        } else {
          console.error("Failed to fetch recommended boards", error);
        }
      }
    } else {
      setBoards([]);
      setPage(0);
      getBoards();
    }
  };

  useEffect(() => {
    console.log("Boards state changed:", boards);
  }, [boards]);

  return (
    <div>
      <div className="user-option">
        <select value={repAddressIdx} onChange={handleChange}>
          {combinedAddressList.map((address, index) => (
            <option key={index} value={index}>
              {address}
            </option>
          ))}
        </select>
        <label className="recommand">
          자동 추천
          <input
            type="checkbox"
            checked={autoRecommend}
            onChange={handleAutoRecommendChange}
          />
        </label>
      </div>
      <div
        className="board-page"
        style={{ maxHeight: `${maxHeight}px` }}
        ref={listRef}
      >
        {!boards || boards.length === 0 ? (
          <div className="not-found-content">게시글이 존재하지 않습니다.</div>
        ) : (
          <BoardList boards={boards} />
        )}

        {isLoading && <div className="loading-spinner">Loading...</div>}

        <div className="last-item" style={{ height: "1px" }}></div>
      </div>
    </div>
  );
};

export default Board;
