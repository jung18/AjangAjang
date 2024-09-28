# 아장아장
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
### API 명세서
### ERD
![erd](https://github.com/user-attachments/assets/8a75bb09-aae4-4601-920e-4256ba62da40)


