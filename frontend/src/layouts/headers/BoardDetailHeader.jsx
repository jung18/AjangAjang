import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./BoardDetailHeader.css";

import Modal from "../../components/Modal";

import BackIcon from "../../assets/icons/back.png";
import MenuIcon from "../../assets/icons/menu.png";
import CloseIcon from "../../assets/icons/close.png";

function BoardDetailHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const isDesktop = true;
  //const [isInitialized, setIsInitialized] = useState(false);

  /*useEffect(() => {
    const initializeState = async () => {
      // 페이지가 로드될 때 카카오 SDK 초기화
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("52e5bcd6a8e1bcaa77e88448ac6a2d17"); // 발급받은 JavaScript 키 사용
      }

      // 모바일 환경 감지
      const mobileCheck = /Mobi|Android/i.test(navigator.userAgent);
      
      setIsInitialized(true);
    };

    initializeState();
  }, []);*/

  const handleBackBtnClick = () => {
    /*if (isInitialized) {
      navigate(-1);
    }*/
    navigate(-1);
  };

  const handleMenuBtnClick = () => {
    setIsMenuOpen((prev) => !prev);
    /*if (isInitialized) {
      setIsMenuOpen((prev) => !prev);
    }*/
  };

  const handleOutsideClick = (event) => {
    /*if (isInitialized && !event.target.closest(".menu")) {
      setIsMenuOpen(false);
    }*/
    if (!event.target.closest(".menu")) setIsMenuOpen(false);
  };

  const handleShareClick = () => {
    if (isDesktop) {
      // 데스크톱 환경에서 링크 복사 기능 제공
      navigator.clipboard.writeText(window.location.href).then(
        () => {
          alert("링크가 클립보드에 복사되었습니다.");
        },
        () => {
          alert("링크 복사에 실패했습니다.");
        }
      );
    } else {
      // 모바일 환경에서 카카오톡 공유 기능 제공
      if (window.Kakao && window.Kakao.isInitialized()) {
        window.Kakao.Link.sendDefault({
          objectType: "feed",
          content: {
            title: "제목",
            description: "설명",
            imageUrl: "https://your-image-url.com", // 이미지 URL
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
          buttons: [
            {
              title: "웹으로 보기",
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
          ],
        });
      }
    }
    setIsMenuOpen(false);
  };

  const handleReportClick = () => {
    setIsReportModalOpen(true); // 모달을 열기 위해 상태를 true로 설정
    setIsMenuOpen(false); // 메뉴 닫기
  };

  const closeModal = () => {
    setIsReportModalOpen(false); // 모달을 닫기 위해 상태를 false로 설정
  };

  const report = () => {
    //신고 확인 후 로직 작성
    setIsReportModalOpen(false);
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

  /*if (isInitialized === false) {
    return <div>Loading...</div>;
  }*/

  return (
    <header>
      <button className="back-btn">
        <img
          className="icon"
          alt="icon"
          src={BackIcon}
          onClick={handleBackBtnClick}
        />
      </button>
      <div className="menu">
        <button className="menu-btn">
          <img
            className="icon"
            alt="icon"
            src={MenuIcon}
            onClick={handleMenuBtnClick}
          />
        </button>
        {isMenuOpen && (
          <div className="menu-option">
            <div onClick={handleShareClick}>공유하기</div>
            <div onClick={handleReportClick}>신고하기</div>
          </div>
        )}
      </div>
      {isReportModalOpen && (
        <Modal onClose={closeModal}>
          <div className="modal-close-btn">
            <button onClick={closeModal}>
              <img alt="close-icon" src={CloseIcon} />
            </button>
          </div>
          <div className="modal-title">신고하기</div>
          <input className="report-content" type="text" placeholder="신고 사유를 작성해주세요." />
          <button className="report-btn" onClick={report}>확인</button>
        </Modal>
      )}
    </header>
  );
}

export default BoardDetailHeader;
