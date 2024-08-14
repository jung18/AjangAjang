import axios from 'axios';
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import cameraImage from "../../assets/camera.png";
import videoImage from "../../assets/video.png";
import deleteIcon from "../../assets/delete.png";
import apiClient from "../../api/apiClient";
import "./BoardWriter.css";
import usePageStore from "../../store/currentPageStore";
import useUserStore from "../../store/useUserStore";

const BoardWrite = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [addressList, setAddressList] = useState([]);
  const [mainAddress, setMainAddress] = useState();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("ETC");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("FOR_SALE");

  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBgRemoved, setIsBgRemoved] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);
  const location = useLocation();
  const [uploadedFiles, setUploadedUrls] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/api/user/my");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    const fetchAddress = async () => {
      try {
        const response = await apiClient.get("/api/address/my");

        if (response.data && response.data.data && response.data.data.length > 0) {
          const addressData = response.data.data;

          let mainAddressIndex = -1;
          addressData.forEach((address, index) => {
            if (address.addressId === user.mainAddressId) {
              mainAddressIndex = index;
              setRegion(address.fullAddress);
            }
          });

          if (mainAddressIndex === -1 && addressData.length > 0) {
            setMainAddress(0);
            setRegion(addressData[0].fullAddress);
          }

          setAddressList(addressData);
        }
      } catch (error) {
        console.error("Failed to fetch address data", error);
      }
    };

    const initialize = async () => {
      if (!user) {
        await fetchUserData();
      }
      await fetchAddress();
      setIsLoading(false);
    };

    initialize();

    if (location.state?.templateData) {
      const { title, content, price } = location.state.templateData;
      setTitle(title || "");
      setContent(content || "");
      setPrice(price || "");
    }

  }, [location.state]);

  const handleCheckboxChange = async () => {
    if (!selectedImage) return;

    setIsBgRemoved((prev) => !prev);

    if (!isBgRemoved) {
      try {
        const formData = new FormData();
        formData.append('files', selectedImage);

        const response = await axios.post("https://i11b210.p.ssafy.io:3443/api/remove-background", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          credentials: 'include'
        });

        const newImage = response.data.data[0];
        setImages((prevImages) =>
          prevImages.map((img, idx) =>
            img === selectedImage ? newImage.url : img
          )
        );
        setSelectedImage(newImage.url);
      } catch (error) {
        console.error('Error removing background', error);
      }
    } else {
      const originalImage = originalImages.find(
        (img) => img.name === selectedImage.name
      );
      if (originalImage) {
        setImages((prevImages) =>
          prevImages.map((img) =>
            img === selectedImage ? originalImage : img
          )
        );
        setSelectedImage(originalImage);
      }
    }
  };

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
      const newFiles = Array.from(e.target.files);
      setImages([...images, ...newFiles]);
      setOriginalImages([...originalImages, ...newFiles]);
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
    setOriginalImages(originalImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("제목, 가격, 내용은 반드시 입력해야 합니다.");
      return;
    }

    const createBoardDto = {
      title,
      price: parseInt(price),
      content,
      category,
      status,
      addressId: 1,
    };

    const formData = new FormData();
    formData.append(
      "board",
      new Blob([JSON.stringify(createBoardDto)], { type: "application/json" })
    );
    images.forEach((image) => {
      formData.append("media", image);
    });

    try {
      await apiClient.post("/api/board", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/direct");
    } catch (error) {
      console.error("Error submitting the form", error);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsBgRemoved(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
      </div>
      <div style={{ display: "flex", flexDirection: "row", margin: "15px", alignItems: "center" }}>
        <span className="region-label">지역 선택</span>
        <select
          value={region}
          onChange={handleRegionChange}
          className="region-select"
        >
          {addressList.map((address, index) => (
            <option key={index} value={address.addressId}>
              {address.fullAddress}
            </option>
          ))}
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
                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                alt={`Preview ${index}`}
                className="image-thumbnail"
                onClick={() => handleImageClick(image)}
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
      {selectedImage && (
        <div className="selected-image-container">
          <img
            src={typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedImage)}
            alt="Selected Preview"
            className="selected-image"
            height="200px"
            width="200px"
          />
          <label>
            <input
              type="checkbox"
              checked={isBgRemoved}
              onChange={handleCheckboxChange}
            />
            누끼 따기
          </label>
          <button
            type="button"
            onClick={() => setUploadedUrls(images)}
            className="apply-button"
          >
            설정
          </button>
        </div>
      )}
      <div className="camera-section">
        <div className="image-preview">
          {uploadedFiles.map((data, index) => (
            <div key={index} className="image-container">
              <img src={data.url} alt={`Preview ${index}`} className="image-thumbnail" />
              <img
                src={deleteIcon}
                alt="Delete Icon"
                className="delete-icon"
                onClick={() => handleDeleteImage(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};

export default BoardWrite;
