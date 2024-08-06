import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import SignUp from "./pages/signup/SignUp"
import Board from "./pages/board/Board";
import Login from "./pages/login/Login";
import BoardWriter from "./pages/boardwriter/BoardWriter";
import Search from "./pages/search/Search";
import BoardDetail from "./pages/boardDetail/BoardDetail";

import PageLayout from "./layouts/PageLayout";
import usePageStore from "./store/currentPageStore";

const AppRoutes = () => {
  const location = useLocation();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  useEffect(() => {
    // 라우트 변경 시 currentPage 업데이트
    console.log(location.pathname);
    setCurrentPage(location.pathname);
  }, [location.pathname, setCurrentPage]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/direct"
        element={
          <PageLayout
            page={<Board salseType={"direct"} />}
            pageType={"board"}
          />
        }
      />
      <Route
        path="/parcel"
        element={
          <PageLayout
            page={<Board salseType={"parcel"} />}
            pageType={"board"}
          />
        }
      />
      <Route
        path="/post"
        element={<PageLayout page={<BoardWriter />} pageType={"search"} />}
      />
      <Route
        path="/search"
        element={<PageLayout page={<Search />} pageType={"search"} />}
      />
      <Route
        path="/direct/:id"
        element={
          <PageLayout
            page={<BoardDetail salseType={"direct"} />}
            pageType={"boardDetail"}
          />
        }
      />
      <Route
        path="/parcel/:id"
        element={
          <PageLayout
            page={<BoardDetail salseType={"parcel"} />}
            pageType={"boardDetail"}
          />
        }
      />
      <Route
        path="/post/template"
        element={
          <PageLayout />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
