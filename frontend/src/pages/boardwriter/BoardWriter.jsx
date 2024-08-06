import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import cameraImage from '../../assets/camera.png';
import videoImage from '../../assets/video.png';
import deleteIcon from '../../assets/delete.png'; // 삭제 아이콘 추가
import apiClient from '../../api/apiClient';
import './BoardWriter.css'; // CSS 파일 import

const BoardWrite = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [status, setStatus] = useState('SOLD_OUT'); // status 상태 추가
  const [deliveryType, setDeliveryType] = useState('DIRECT'); // deliveryType 상태 추가
  const [images, setImages] = useState([]); // 이미지 상태를 배열로 변경
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

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    navigate('/post'); // 보드 페이지로 이동
  };
  
  const handelTemplate = () => {
    navigate('/post/template'); // 템플릿 이동
  }

  const isFormValid = () => {
    return title.trim() !== '' && price.trim() !== '' && content.trim() !== '';
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert('제목, 가격, 내용은 반드시 입력해야 합니다.');
      return;
    }

    const createBoardDto = {
      title,
      price: parseInt(price),
      content,
      category,
      region,
      status,
      deliveryType,
      writerId: 1
    };

    const formData = new FormData();
    formData.append('board', new Blob([JSON.stringify(createBoardDto)], { type: 'application/json' }));
    images.forEach((image) => {
      formData.append('media', image); // 서버에서 배열로 받도록 설정
    });

    const url = '/api/board';

    try {
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
      navigate('/post'); // 전송이 완료되면 리다이렉션
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="board-write-container">
      <div className="header">
        <button type="button" className="template-button" onClick={handelTemplate}>템플릿</button>
        <div>
          <button type="button" className="cancel-button" onClick={handleCancel}>취소</button>
          <button type="submit" className="submit-button" disabled={!isFormValid()}>완료</button>
        </div>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={handleTitleChange}
          className="input-field"
        />
        <select value={category} onChange={handleCategoryChange} className="category-select">
          <option value="유모차">유모차</option>
          <option value="장난감">장난감</option>
          <option value="아기옷">아기옷</option>
          <option value="카시트">카시트</option>
          <option value="기타">기타</option>
        </select>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="가격"
          value={price}
          onChange={handlePriceChange}
          className="input-field"
        />
        <span className="region-label">지역 선택</span>
        <select value={region} onChange={handleRegionChange} className="region-select">
          <option value="선택">선택</option>
          {/* 지역 옵션 추가 가능 */}
        </select>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="지역"
          value={region}
          onChange={handleRegionChange}
          className="input-field"
        />
      </div>
      <textarea
        placeholder="내용을 입력하세요."
        value={content}
        onChange={handleContentChange}
        className="textarea-field"
      />
      <div className="camera-section">
        <div className="video-icon" onClick={handleIconClick}>
          <img src={videoImage} alt="Video Icon" className="camera-image" />
        </div>
        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="image-container">
              <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="image-thumbnail" />
              <img
                src={deleteIcon}
                alt="Delete Icon"
                className="delete-icon"
                onClick={() => handleDeleteImage(index)}
              />
            </div>
          ))}
        </div>
        <div className="camera-icon" onClick={handleIconClick}>
          <img src={cameraImage} alt="Camera Icon" className="camera-image" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple // 여러 장 선택 가능하도록 설정
      />
    </form>
  );
};

export default BoardWrite;
