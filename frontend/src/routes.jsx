import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import SignUp from "./pages/signup/SignUp";
import Board from "./pages/board/Board";
import Login from "./pages/login/Login";
import BoardWriter from "./pages/boardwriter/BoardWriter";
import Search from "./pages/search/Search";
import BoardDetail from "./pages/boardDetail/BoardDetail";
import BoardTemplate from "./pages/boardwriter/BoardTemplate";
import Chat from "./pages/chat/Chat";
import ChatRoom from "./pages/chat/ChatRoom";
import AudioCall from "./pages/openvidu/AudioCall";
import AudioTest from "./pages/openvidu/AudioTest";

import PageLayout from "./layouts/PageLayout";
import usePageStore from "./store/currentPageStore";
import MyPage from "./pages/myPage/myPage";
import MyBoard from "./pages/myboard/MyBoard";
import MyLike from "./pages/myLike/MyLike";
import MyReview from "./pages/myReview/MyReview";
import MyInfo from "./pages/myInfo/MyInfo";

import GeoLocation from "./pages/geoLocation/GeoLocation";
import Location from "./pages/location/Location";

import MyTrade from "./pages/myTrade/MyTrade";
import EditMyInfo from "./pages/myInfo/EditMyInfo";

import BoardEditor from "./pages/boardEditor/BoardEditor";


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
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/user" element={<PageLayout page={<MyPage />} pageType={"myPage"} />} />
      <Route path="/user/boards" element={<PageLayout page={<MyBoard />} pageType={"myBoard"} />} />
      <Route path="/user/likes" element={<PageLayout page={<MyLike />} pageType={"myLike"} />} />
      <Route path="/user/trades" element={<PageLayout page={<MyTrade />} pageType={"myTrade"} />} />
      <Route path="/user/reviews" element={<PageLayout page={<MyReview />} pageType={"myBoard"} />} />
      <Route path="/user/myinfo" element={<PageLayout page={<MyInfo />} pageType={"myInfo"} />} />

      <Route path="/gps" element={<GeoLocation />} />
      <Route path="/room/:roomId/recommend" element={<PageLayout page={<Location />} pageType={"recommendLocation"} />} />

      <Route path="/user/myinfo/edit" element={<PageLayout page={<EditMyInfo />} pageType={"myInfo"} />} />

      <Route
        path="/direct"
        element={
          <PageLayout
            page={<Board />}
            pageType={"board"} 
          />
        }
      />
       <Route
        path="/post"
        element={<PageLayout page={<BoardWriter />} pageType={"post"} />}
      >
      </Route>
      <Route
        path="/search"
        element={<PageLayout page={<Search />} pageType={"search"} />}
      />
      <Route
        path="/post/template"
        element={<PageLayout page={<BoardTemplate />} pageType={"template"} />}
      />
      <Route
        path="/board/:id"
        element={
          <PageLayout
            page={<BoardDetail />}
            pageType={"boardDetail"}
          />
        }
      />
      <Route
        path="/edit/:id"
        element={
          <PageLayout
            page={<BoardEditor />}
            pageType={"search"}
          />
        }
      />
      <Route path="/room/:roomId" element={<PageLayout page={<Chat />} pageType={"chat"} />} />
      <Route path="/chat" element={<PageLayout page={<ChatRoom />} pageType={"chat"} />} />
      <Route path="/audio-call/:sessionId" element={<AudioCall />} />
      <Route path="/audio-call-test" element={<AudioTest />} />
      {/* <Route 
        path="/chat" 
        element={
          <PageLayout 
            page={<ChatRoom />} 
            pageType={"chat"} 
          />
        } 
      />
      <Route 
        path="/room/:roomId" 
        element={
          <PageLayout 
            page={<Chat />} 
            pageType={"chating"} 
          />
        } 
      /> */}
      {/* <Route path="/room/:roomId" element={<Chat />} /> */}
    </Routes>
  );
};

export default AppRoutes;
