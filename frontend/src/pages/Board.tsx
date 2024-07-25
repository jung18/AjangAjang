import React from 'react';
import { Link } from 'react-router-dom';

const Board: React.FC = () => {
  return (
    <div>
      <h1>Board</h1>
      <Link to="/board/write">Write a new post</Link>
    </div>
  );
};

export default Board;
