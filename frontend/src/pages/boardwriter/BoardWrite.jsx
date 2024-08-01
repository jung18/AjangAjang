import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import cameraImage from '../../assets/camera.png'; // 경로 수정
import apiClient from '../../api/apiClient'; // 경로 수정

const BoardWrite = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('유모차');
  const [status, setStatus] = useState('SOLD_OUT'); // status 상태 추가
  const [deliveryType, setDeliveryType] = useState('DIRECT'); // deliveryType 상태 추가
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // 리다이렉션을 위해 useNavigate 사용

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleDeliveryTypeChange = (e) => {
    setDeliveryType(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const createBoardDto = {
      title,
      price: parseInt(price),
      content,
      status,
      deliveryType,
      category,
      writerId: 1 // 임시로 writerId 설정, 실제 사용 시에는 적절한 값을 설정해야 함
    };

    const formData = new FormData();
    formData.append('board', new Blob([JSON.stringify(createBoardDto)], { type: 'application/json' }));
    if (image) {
      formData.append('media', image);
    }

    const url = '/api/board';

    try {
      const response = await apiClient.post(url, formData);
      console.log('Response:', response.data);
      navigate('/board'); // 전송이 완료되면 리다이렉션
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
