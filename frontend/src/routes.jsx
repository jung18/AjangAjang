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
import ChatTest from "./pages/chatTest/ChatTest";
import ChatRoom from "./pages/chat/ChatRoom";
import AudioCall from "./pages/openvidu/AudioCall";
import AudioTest from "./pages/openvidu/AudioTest";

import PageLayout from "./layouts/PageLayout";
import usePageStore from "./store/currentPageStore";
import MyPage from "./pages/myPage/myPage";
import MyBoard from "./pages/myboard/MyBoard";
import MyLike from "./pages/myLike/MyLike";
import MyInfo from "./pages/myInfo/MyInfo";
import MyTrade from "./pages/myTrade/MyTrade";

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
      <Route path="/test" element={<ChatTest />} />
      <Route path="/" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/user" element={<PageLayout page={<MyPage />} pageType={"myPage"} />} />
      <Route path="/user/boards" element={<PageLayout page={<MyBoard />} pageType={"myBoard"} />} />
      <Route path="/user/likes" element={<PageLayout page={<MyLike />} pageType={"myLike"} />} />
      <Route path="/user/trades" element={<PageLayout page={<MyTrade />} pageType={"myTrade"} />} />
      <Route path="/user/myinfo" element={<PageLayout page={<MyInfo />} pageType={"myInfo"} />} />
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
        path="/parcel"
        element={
          <PageLayout
            page={<Board />}
            pageType={"board"}
          />
        }
      />
       <Route
        path="/post"
        element={<PageLayout page={<BoardWriter />} pageType={"search"} />}
      >
      </Route>
      <Route
        path="/search"
        element={<PageLayout page={<Search />} pageType={"search"} />}
      />
      <Route
        path="/direct/:id"
        element={
          <PageLayout
            page={<BoardDetail />}
            pageType={"boardDetail"}
          />
        }
      />
      <Route
        path="/parcel/:id"
        element={
          <PageLayout
            page={<BoardDetail />}
            pageType={"boardDetail"}
          />
        }
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
