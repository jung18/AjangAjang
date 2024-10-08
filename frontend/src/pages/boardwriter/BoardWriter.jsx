import axios from "axios";
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
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);
  const location = useLocation();

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

        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
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

    setIsLoading(true); // 로딩 시작

    const selectedIndex = images.findIndex(
      (img) => img.id === selectedImage.id
    );

    if (!images[selectedIndex].bgRemovedImage) {
      try {
        const formData = new FormData();
        formData.append("files", selectedImage.original);

        const response = await axios.post(
          "https://i11b210.p.ssafy.io:4443/api/remove-background",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            credentials: "include",
          }
        );

        const newImage = response.data.data[0];
        const updatedImages = [...images];
        updatedImages[selectedIndex].bgRemovedImage = newImage.url;
        setImages(updatedImages);
        setSelectedImage(updatedImages[selectedIndex]);
      } catch (error) {
        console.error("Error removing background", error);
      }
    }

    setSelectedImage((prev) => ({
      ...prev,
      isBgRemoved: !prev.isBgRemoved,
    }));

    setIsLoading(false); // 로딩 종료
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
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: `${file.name}-${Date.now()}`,
        original: file,
        bgRemovedImage: null,
        isBgRemoved: false,
      }));
      setImages([...images, ...newFiles]);
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
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  
    if (updatedImages.length === 0) {
      setSelectedImage(null); // 이미지가 없을 때 선택된 이미지도 초기화
    }
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
      addressId: user.mainAddressId,
    };

    const formData = new FormData();
    formData.append(
      "board",
      new Blob([JSON.stringify(createBoardDto)], { type: "application/json" })
    );

    // imageUrls를 저장할 배열 생성
    const imageUrls = [];

    images.forEach((image) => {
      console.log(image.bgRemovedImage);
      console.log(image.isBgRemovedImage);
      if (image.isBgRemoved) {
        console.log("여기입니다!!!!!!!!!!!!!!!!!!");
        // 누끼 딴 이미지 URL을 배열에 추가
        imageUrls.push(image.bgRemovedImage);
      } else {
        formData.append(
          "media",
          new Blob([image.original], { type: image.original.type })
        );
      }
    });
    formData.append(
      "imageUrls",
      new Blob([JSON.stringify(imageUrls)], { type: "application/json" })
    );
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await apiClient.post("/api/board", formData);
      navigate("/direct");
    } catch (error) {
      console.error("Error submitting the form", error);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleApply = () => {
    if (selectedImage) {
      const updatedImages = images.map((img) =>
        img.id === selectedImage.id ? selectedImage : img
      );
      setImages(updatedImages);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="board-write2-container">
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          margin: "15px",
          alignItems: "center",
        }}
      >
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
        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="image-container">
              <img
                src={
                  image.isBgRemoved && image.bgRemovedImage
                    ? image.bgRemovedImage
                    : URL.createObjectURL(image.original)
                }
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
            src={
              selectedImage.isBgRemoved && selectedImage.bgRemovedImage
                ? selectedImage.bgRemovedImage
                : URL.createObjectURL(selectedImage.original)
            }
            alt="Selected Preview"
            className="selected-image"
          />
          <div className="btns-checkbox">
            {isLoading ? (
              <div className="loading-spinner"></div> // 로딩 중일 때 스피너 표시
            ) : (
              <label>
                <input
                  type="checkbox"
                  checked={selectedImage.isBgRemoved}
                  onChange={handleCheckboxChange}
                />
                누끼 따기
              </label>
            )}
            <button
              type="button"
              onClick={handleApply}
              className="apply-button"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default BoardWrite;
