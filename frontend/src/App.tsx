import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Board from './pages/Board';
import SignUp from './components/login/SignUp'
import BoardWrite from './components/board/BoardWrite';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/write" element={<BoardWrite />} />
      </Routes>
    </Router>
  );
};

export default App;
