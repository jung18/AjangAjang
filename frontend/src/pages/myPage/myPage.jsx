import React, { useState, useEffect } from "react";
import styles from "./myPage.module.css";
import { useNavigate } from 'react-router-dom';
import usePageStore from "../../store/currentPageStore";
import apiClient from "../../api/apiClient";
import ImageNotFound from "../../assets/icons/image-not-found.png";

function MyPage() {
  const navigate = useNavigate();
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [level, setLevel] = useState('');

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await apiClient.get('/api/user/my');
        if (response.data) {
          setNickname(response.data.nickname);
          console.log("Nickname:", response.data.nickname);
          console.log("Profile Image URL:", response.data.profileImg);
          setProfileImage(response.data.profileImg || ImageNotFound); // 프로필 이미지 URL 설정
          setLevel(response.data.level);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleClickBoard = () => {
    setCurrentPage("my-boards");
    navigate('/user/boards'); 
  };

  const handleClickReview = () => {
    setCurrentPage("my-reviews");
    navigate(`/user/reviews`); 
  };

  const handleClickLike = () => {
    setCurrentPage("my-likes");
    navigate(`/user/likes`); 
  };

  const handleClickTrade = () => {
    setCurrentPage("my-trades");
    navigate(`/user/trades`);
  };

  const handleClickMyInfo = () => {
    setCurrentPage("my-info");
    navigate(`/user/myinfo`);
  };

  const handleClickLogOut = () => {
    sessionStorage.removeItem('token-storage');
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const handleClickDeleteUser = () => {
    alert('탈퇴 호출 api 작성하세요');
  }

  // 프로필 이미지 변경 로직
  const handleProfileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setSelectedImage(URL.createObjectURL(file));
        
        // FormData 생성
        const formData = new FormData();
        formData.append('profile', file); // 프로필 이미지 업로드

        // 프로필 이미지 업로드 요청
        apiClient.post('/api/user/profile', formData)
            .then(response => {
                if (response.data && response.data.profileImg) {
                    setProfileImage(response.data.profileImg); // 업로드된 이미지 URL 설정
                    alert('프로필 이미지가 성공적으로 업로드되었습니다.');
                }
            })
            .catch(error => {
                console.error('Error uploading profile image:', error);
                alert('프로필 이미지 업로드 중 오류가 발생했습니다.');
            });
    }
  };

  return (
    <div className={styles.myPage}>
      <div className={styles.profile}>
        <div className={styles.profileImage}>
          <img
            src={selectedImage || profileImage}
            alt="Profile"
            onClick={() => document.getElementById('imageUpload').click()}
          />
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleProfileChange}
          />
        </div>
      </div>
      <div className={styles.profileInfo}>
        <h3>닉네임: {nickname}</h3>
        <p>{level}</p>
      </div>
      <div className={styles.menu}>
        <div className={styles.menuitemcontainer}>
          <div className={styles.menuItem} onClick={handleClickBoard}>내 작성글</div>
          <div className={styles.menuItem} onClick={handleClickReview}>리뷰목록</div>
        </div>
        <div className={styles.menuitemcontainer}>
          <div className={styles.menuItem} onClick={handleClickLike}>찜한목록</div>
          <div className={styles.menuItem} onClick={handleClickTrade}>거래내역</div>
        </div>
        <div className={styles.menuitemcontainer}>
          <div className={styles.myInfo} onClick={handleClickMyInfo}>회원정보 수정</div>
        </div>
        <div className={styles.menuitemcontainer}>
          <div className={styles.myInfo} onClick={handleClickLogOut}>로그 아웃</div>
        </div>
        <div className={styles.menuitemcontainer}>
          <div className={styles.myInfo} onClick={handleClickDeleteUser}>회원 탈퇴</div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
