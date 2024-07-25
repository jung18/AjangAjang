import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cameraImage from '../../assets/camera.png'; // 경로 수정

const BoardWrite: React.FC = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('유모차');
  const [status, setStatus] = useState('SOLD_OUT'); // status 상태 추가
  const [deliveryType, setDeliveryType] = useState('DIRECT'); // deliveryType 상태 추가
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate(); // 리다이렉션을 위해 useNavigate 사용

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleDeliveryTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryType(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const getAuthorizationToken = () => {
    const name = "Authorization=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        const token = cookie.substring(name.length, cookie.length);
        // Bearer 접두사가 포함되어 있는지 확인하고, 필요하면 추가합니다.
        return token;
      }
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const board = new FormData();
    board.append('title', title);
    board.append('price', price);
    board.append('content', content);
    board.append('status', status);
    board.append('deliveryType', deliveryType);
    board.append('category', category);
    if (image) {
      board.append('image', image);
    }

    const token = getAuthorizationToken();
    const url = 'http://localhost:8080/api/board';

    console.log('Authorization Token:', token); // 토큰 출력
    console.log('Request URL:', url); // URL 출력

    try {
      const response = await axios.post(url, board, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token, // Bearer 접두사 포함된 토큰
        },
      });
      console.log('Response:', response.data);
      navigate('/board/all'); // 전송이 완료되면 리다이렉션
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button type="button">취소</button>
          <h2>직거래</h2>
          <button type="submit">완료</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <select value={category} onChange={handleCategoryChange}>
            <option value="유모차">유모차</option>
            <option value="카시트">카시트</option>
            <option value="기저귀">기저귀</option>
            {/* 다른 카테고리 옵션을 추가할 수 있습니다. */}
          </select>
          <button type="button">임시저장</button>
        </div>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={handleTitleChange}
          style={{ width: '100%', marginBottom: '20px', padding: '10px', fontSize: '16px' }}
        />
        {/*
        <input
          type="text"
          placeholder="상태"
          value={status}
          onChange={handleStatusChange}
          style={{ width: '100%', marginBottom: '20px', padding: '10px', fontSize: '16px' }}
        />
        <input
          type="text"
          placeholder="배송 타입"
          value={deliveryType}
          onChange={handleDeliveryTypeChange}
          style={{ width: '100%', marginBottom: '20px', padding: '10px', fontSize: '16px' }}
        />
        */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ marginRight: '10px', cursor: 'pointer' }} onClick={handleIconClick}>
            <img src={cameraImage} alt="" style={{ width: '50px', height: '50px' }} />
          </div>
          <input
            type="text"
            placeholder="가격"
            value={price}
            onChange={handlePriceChange}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={handleContentChange}
          style={{ width: '100%', height: '200px', padding: '10px', fontSize: '16px' }}
        />
      </form>
    </div>
  );
};

export default BoardWrite;
