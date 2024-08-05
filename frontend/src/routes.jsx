import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Board from './pages/board/Board';
import Login from './pages/login/Login';
import BoardWrite from "./pages/boardwriter/BoardWrite"
import Search from './pages/search/Search';
import BoardDetail from "./pages/boardDetail/BoardDetail";

import PageLayout from './layouts/PageLayout';

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/direct" element={<PageLayout page={<Board salseType={"direct"} />} pageType={"board"} />} />
      <Route path="/parcel" element={<PageLayout page={<Board salseType={"parcel"} />} pageType={"board"} />}/>
      <Route path="/post" element={<PageLayout page={<BoardWrite />} pageType={"search"}/>}/>
      <Route path="/search" element={<PageLayout page={<Search />} pageType={"search"}/>}/>
      <Route path="/direct/:id" element={<PageLayout page={<BoardDetail salseType={"direct"} />} pageType={"boardDetail"} />} />
      <Route path="/parcel/:id" element={<PageLayout page={<BoardDetail salseType={"parcel"} />} pageType={"boardDetail"} />} />
    </Routes>
  );
};

export default AppRoutes;
