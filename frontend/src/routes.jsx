import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Board from './pages/board/Board';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp'; // 경로 수정
import BoardWrite from './pages/boardwriter/BoardWriter'; // 경로 수정
import BoardTemplate from './pages/boardwriter/BoardTemplate'
// import PageLayout from './layout/PageLayout';
// import BoardDetail from './pages/BoardDetail';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/board" element={<Board />} />
      <Route path="/board/write" element={<BoardWrite />} />
      <Route path="/board/template" element={<BoardTemplate />} />
      
      {/* <Route path="/board/:boardId" element={<PageLayout page={<BoardDetail />} />} /> */}
    </Routes>
  );
};

export default RoutesComponent;
