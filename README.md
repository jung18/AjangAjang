<img src="https://github.com/user-attachments/assets/12fa1cbe-5110-4e41-90fd-9d271bb37853" alt="logo" width="280" height="100" />

---

## 목차
1. 서비스 소개
2. 기획 배경
3. 기술 스택
4. 기능 소개
5. 프로젝트 산출물

## 서비스 소개
### 개요 
- **설명**: 지역기반 육아용품 중고거래 플랫폼

- **타겟층**: 고가의 육아용품 구매에 부담을 느끼는 부모 및 예비부모

- **진행기간**: 2024.07.08 ~ 2024.08.16 (6주)

## 기획 배경
![news](https://github.com/user-attachments/assets/a6f54d28-b237-475d-a73f-e65027b19657)
- 최근 물가상승으로 인해 육아용품의 가격이 상승하고 있다. 육아용품의 특성상 가격에 비해 사용 기간이 짧아, 모든 제품을 새것으로 구매하는데 부담을 느끼는 부모들이 증가하고 있다. 

- 이로 인해 신생아용부터 유아용까지 다양한 품목을 구비해야 하는 상황에서, 저렴한 가격에 제품을 구매하고자 중고거래에 대한 인기가 높아지고 있다. 이를 기반으로, 육아용품을 안전하고 편리하게 거래할 수 있는 중고 거래 플랫폼을 통해 부모들의 경제적 부담을 덜고 합리적인 소비를 돕고자 한다.

- **목표**
    - **경제적 부담 완화**: 합리적인 가격의 중고 육아용품을 거래할 수 있는 장터를 제공하여 육아에 대한 경제적 부담 감소

    - **편리한 거래 환경 구축**: 사용자들이 신뢰할 수 있는 거래를 할 수 있도록, 판매자와 구매자 간의 리뷰 및 등급 시스템을 도입하고, 편의성과 거래 안전성을 강화한 중고 거래 플랫폼을 구축

    - **사용자 맞춤형 추천 서비스 제공**: 사용자의 자녀들을 그룹화하고 그룹별 판매글 조회수를 추적해 사용자의 육아 단계에 맞는 제품 및 비슷한 자녀를 가진 사람들에게 인기있는 제품을 추천

## 기술 스택
### Front-end
<div>
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/pwa-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white">
</div>

### Back-end
<div>
<img src="https://img.shields.io/badge/spring boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/spring security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white">
<img src="https://img.shields.io/badge/fastapi-009688?style=for-the-badge&logo=fastapi&logoColor=white">
<img src="https://img.shields.io/badge/elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white">
</div>

### DB
<div>
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white">
<img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
</div>

### Infra
<div>
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
<img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white">
<img src="https://img.shields.io/badge/amazon s3-569A31?style=for-the-badge&logo=amazons3&logoColor=white">
<img src="https://img.shields.io/badge/amazon ec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
</div>

### 아키텍처 설계도
![diagram](https://github.com/user-attachments/assets/c9569fac-660f-4e51-ab49-e6ef32292c0d)

## 기능 소개

### 지역기반 거래
- 마이페이지에서 내 위치을 등록해 주변 최대 15km범위 지역의 판매글들을 볼 수 있습니다. 사용자는 가까움(5km), 중간(10km), 먼거리(15km)로 판매글 조회 범위를 설정할 수 있습니다.

- 한번에 여러 위치를 등록해두고 메인페이지 또는 마이페이지에서 기준 위치를 설정 및 변경할 수 있습니다.

### 자녀 기반 추천
- 회원가입 시 또는 마이페이지에서 내 자녀의 나이와 성별을 등록할 수 있습니다. 

- 자녀의 나이, 성별을 기준으로 사용자들을 그룹화해 비슷한 자녀를 가진 사용자들이 자주보는 카테고리의 글들을 추천받을 수 있습니다.

### 판매글 작성
- 제목 및 내용을 작성하고 판매글의 카테고리를 선택해야 합니다. 사진은 최대 3장, 영상은 최대 1개를 업로드할 수 있습니다.

- 글 작성 페이지 상단의 템플릿 버튼을 누르면 생성형 AI를 활용해 상품명, 가격, 간단한 설명을 제공하고 판매글을 자동으로 생성할 수 있습니다.

- 생성된 템플릿을 판매글 작성 페이지에 반영하고 필요시 사용자가 수정할 수 있습니다.

### 판매글 조회
- 메인 판매글 목록이 나타나며 판매자가 업로드한 썸네일과 카테고리, 제목, 가격, 찜한 사용자 수가 제공됩니다.

- 판매글을 들어가면 판매자가 업로드한 사진들을 옆으로 넘겨가며 볼 수 있으며, 사진 우측 하단에 비디오 버튼을 눌러 영상을 볼 수 있습니다. 사진 좌측 하단의 하트를 눌러 판매글을 찜할 수 있습니다.

- 사진 밑에 판매자 정보가 제공되며 옆의 채팅하기 버튼을 눌러 해당 판매자와의 채팅을 시작할 수 있습니다.

### 채팅하기
- 화면 하단의 네비게이션 바의 채팅을 눌러 내 채팅 목록을 볼 수 있습니다. 읽지 않은 채팅이 있을 경우 목록에 표시됩니다.

- 채팅방에 들어가면 우측 상단의 전화 아이콘을 눌러 상대방과 음성 채팅을 시작할 수 있습니다. 우측 상단의 메뉴를 눌러 거래장소 추천받기 페이지로 이동할 수 있습니다.

### 판매글 검색
![searchdiagram](https://github.com/user-attachments/assets/d5c0e7db-e657-4fee-a63a-bfc39f1bf902)
- 네이버 검색어 제안 API를 사용해서 오타가 발생했을 경우 올바른 검색어로 검색한 결과들을 보여주며, 원래 검색어로 검색하기를 선택하여 결과를 다시 조회할 수 있습니다.

- 검색창을 누르고 카테고리들을 선택해서 해당 카테고리 판매글들만 필터링해서 볼 수 있습니다.

### 이미지 배경 제거
![nukkidiagram](https://github.com/user-attachments/assets/ac8c80a7-45a1-4b4e-9e34-739b969ec352)
- 판매글 작성 시 업로드한 이미지를 선택하고 누끼따기 버튼을 눌러 이미지의 배경을 제거할 수 있습니다.

- 배경이 제거된 결과가 아래쪽에 보여지며 사용자는 배경이 제거된 이미지와 원본 중에 선택하여 업로드 할 수 있습니다.

### 거래장소 추천 및 길찾기
![mapdiagram](https://github.com/user-attachments/assets/6e0311b7-f531-450d-a527-cbd88d6f9239)
- 거래 시 판매자근처, 구매자근처, 중간위치중 선택해서 근처 최대 10km내의 은행, 경찰서 및 기타 공공장소를 추천받을 수 있습니다.

- 카카오 지도를 통해서 각 장소들의 위치를 확인할 수 있으며 아래쪽에 장소 정보들이 목록으로 제공됩니다.

- 장소 목록 또는 지도의 마커를 클릭해 해당 위치와 판매자 및 구매자간의 거리, 자동차 기준 시간, 길찾기 경로를 볼 수 있습니다.

## 프로젝트 산출물
### 화면
<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/17801430-3252-4873-8357-46353451dc05" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/501d5d3c-71e9-4bd3-b682-974dff711694" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/2d6ab38e-6873-45fe-aef2-350c2c46979e" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/9db5e7e2-7882-4d4b-b191-baae3ae12c31" width="400"></td>
  </tr>
  <tr>
    <td>회원가입, 로그인</td>
    <td>메인 페이지</td>
    <td>메인 페이지 (추천)</td>
    <td>내 판매글</td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/54fe26b2-147f-4cf3-a1af-40fce6cf059f" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/494e0987-c6ce-426e-9c0e-b664470073bb" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/e66e355c-31ca-4c2c-b888-017adffb8762" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/0c1ac7f3-b3bf-4678-ac6e-62b032ee9abe" width="400"></td>
  </tr>
  <tr>
    <td>판매글 상세 페이지</td>
    <td>영상 재생</td>
    <td>검색 페이지</td>
    <td>검색어 제안</td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/8e9565d6-86da-4635-912d-92b146a4cc31" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/b10423af-bfe8-43fa-aec6-24c7265db736" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/49605263-d367-4c86-aa3a-48d0d593e06b" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/66d65c7a-26f9-4e14-845d-2a698b2c3ec8" width="400"></td>
  </tr>
  <tr>
    <td>판매글 작성</td>
    <td>AI 템플릿</td>
    <td>AI 템플릿</td>
    <td>판매글 작성</td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/ead928d5-24f1-48ba-83e0-1d746fff87eb" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/1c7d0094-3162-4704-80a0-c3b6e7472dc5" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/e6ebdcc8-660a-4118-8b56-ed772332818b" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/c8ea7d4e-08b9-4429-8c5b-14e6dc8071c1" width="400"></td>
  </tr>
  <tr>
    <td>이미지 배경제거</td>
    <td>이미지 배경제거</td>
    <td>마이 페이지</td>
    <td>내 주소, 자녀 정보</td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/0cb54a01-aad6-4146-89f0-7fb9b1e2220b" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/ee552534-ef41-4971-b4bc-518c7702c35b" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/5b5247ac-3116-493b-bbc9-7b7dafbd3ef6" width="400"></td>
    <td></td>
  </tr>
  <tr>
    <td>주소 검색 페이지</td>
    <td>내 자녀 등록</td>
    <td>채팅 페이지</td>
    <td></td>
  </tr>
</table>

### API 명세서
<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/ca696f05-fa7c-4ff6-aede-882bc597349d"></td>
    <td><img src="https://github.com/user-attachments/assets/1f7a9485-9e5c-4cab-85a3-a9a214670b20"></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/0ca24454-123d-49ff-ba42-85a664a76a6d"></td>
    <td><img src="https://github.com/user-attachments/assets/4a527b27-19f1-4399-beda-6b27263d11ea"></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/c3c28829-00b6-4a7f-8ee1-3304300251e8"></td>
    <td><img src="https://github.com/user-attachments/assets/3c82e385-d64e-4575-b86b-5fd052770363"></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/3d068fa9-654b-444e-bf0f-9c20ad54bc93"></td>
    <td></td>
  </tr>
</table>

### ERD
![erd](https://github.com/user-attachments/assets/8a75bb09-aae4-4601-920e-4256ba62da40)


