# Node.js 베이스 이미지를 사용하여 애플리케이션을 빌드합니다.
FROM node:20 AS build

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# package.json과 package-lock.json을 복사하여 의존성을 설치합니다.
# 프론트엔드 파일이 frontend 디렉토리 아래에 있을 경우 경로 수정
COPY frontend/package*.json ./

# 필요한 모든 의존성을 설치합니다.
RUN npm install

# 애플리케이션 소스 코드를 복사합니다.
COPY frontend .

# 애플리케이션을 빌드합니다.
RUN npm run build

# 애플리케이션을 실행합니다.
# 서버 파일이 src/server.js에 있는 경우 경로를 수정하세요.
CMD ["node", "src/server.js"]
