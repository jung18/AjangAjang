import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import useTokenStore from "./store/useTokenStore.js"

import Board from './pages/board/Board';
import Login from './pages/login/Login';
import Search from './pages/search/Search';

import PageLayout from './layouts/PageLayout';

const AppRoutes = () => {
  const accessToken = useTokenStore((state) => state.accessToken);

  return (
    <Routes>
      <Route path="/" element={accessToken ? <Navigate to="/direct" replace /> : <Login />} />
      <Route path="/direct" element={<PageLayout page={<Board salseType={"direct"} />} pageType={"board"} />} />
      <Route path="/parcel" element={<PageLayout page={<Board salseType={"parcel"} />} pageType={"board"} />}/>
      <Route path="/search" element={<PageLayout page={<Search />} pageType={"search"}/>}/>
      <Route path="/test" element={<PageLayout page={<Search />} pageType={"search"}/>}/>
    </Routes>
  );
};

export default AppRoutes;
