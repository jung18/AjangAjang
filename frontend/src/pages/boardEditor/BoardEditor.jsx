import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import cameraImage from "../../assets/camera.png";
import videoImage from "../../assets/video.png";
import deleteIcon from "../../assets/delete.png";
import apiClient from "../../api/apiClient";
import "./BoardEditor.css"; // 동일한 CSS 파일 사용
import usePageStore from "../../store/currentPageStore";

const BoardEditor = () => {
  const navigate = useNavigate();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);
  const location = useLocation();
  const boardDetail = location.state?.boardDetail;
  const { id } = useParams(); 

  const [title, setTitle] = useState(boardDetail.title);
  const [price, setPrice] = useState(String(boardDetail.price));
  const [content, setContent] = useState(boardDetail.content);
  const [category, setCategory] = useState(boardDetail.category);
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState(boardDetail.status);
  const [addressId, setAddressId] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const fileInputRef = useRef(null);

  console.log(boardDetail);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await apiClient.get("/api/address/my");
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          const addressId = response.data.data[0].addressId;
          setAddressId(addressId);
        }
      } catch (error) {
        console.error("Failed to fetch address data", error);
      }
    };

    fetchAddress();

    // mediaList를 순회하여 video와 images 분리
    if (boardDetail.mediaList) {
      const imageList = [];
      boardDetail.mediaList.forEach((media, index) => {
        if (media.mediaType === "VIDEO") {
          setVideo({ url: media.mediaUrl, index });
        } else if (media.mediaType === "IMAGE") {
          imageList.push({
            url: media.mediaUrl,
            file: null, // 기존의 이미지이므로 파일 객체가 없음
          });
        }
      });
      setImages(imageList);
    }
  }, [location.state, boardDetail.mediaList]);

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
      const newImages = Array.from(e.target.files).map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setImages([...images, ...newImages]);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleTemplate = () => {
    setCurrentPage("post/template");
    navigate("/post/template");
  };

  const isFormValid = () => {
    return title.trim() !== "" && price.trim() !== "" && content.trim() !== "";
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("제목, 가격, 내용은 반드시 입력해야 합니다.");
      return;
    }

    const updateBoardDto = {
      title: title,
      price: parseInt(price, 10),
      content: content,
      category: category,
      status: status,
      addressId: addressId,
      deleteFileIds: [], // 서버에서 받을 것으로 예상되는 필드
    };

    const formData = new FormData();
    formData.append(
      "board",
      new Blob([JSON.stringify(updateBoardDto)], { type: "application/json" })
    );

    images.forEach((image) => {
      if (image.file) {
        formData.append("media", image.file);
      }
    });

    console.log(id);
    const url = `/api/board/${id}`;

    try {
      const response = await apiClient.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response.data);
      navigate("/direct");
    } catch (error) {
      console.error("Error updating the form", error);

      if (error.response && error.response.data) {
        console.error("Server Response:", error.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="board-write-container">
      <div className="header">
        <button
          type="button"
          className="template-button"
          onClick={handleTemplate}
        >
          템플릿
        </button>
        <div>
          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid()}
          >
            완료
          </button>
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
        <select
          value={category}
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="ETC">기타</option>
          <option value="DAILY_SUPPLIES">일상용품</option>
          <option value="BABY_CARRIAGE">유모차</option>
          <option value="FURNITURE">아기가구</option>
          <option value="BABY_CLOTHES">아기옷</option>
          <option value="TOY">장난감</option>
          <option value="CAR_SEAT">카시트</option>
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
        <select
          value={region}
          onChange={handleRegionChange}
          className="region-select"
        >
          <option value="선택">선택</option>
          {/* 지역 옵션 추가 가능 */}
        </select>
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
              <img
                src={image.mediaUrl}
                alt={`Preview ${index}`}
                className="image-thumbnail"
              />
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
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple
      />
    </form>
  );
};

export default BoardEditor;
