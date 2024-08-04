# Node.js 베이스 이미지를 사용하여 애플리케이션을 빌드합니다.
FROM node:20 AS build

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# package.json과 package-lock.json을 복사하여 의존성을 설치합니다.
COPY frontend/package*.json ./

# 필요한 모든 의존성을 설치합니다.
RUN npm install

# 애플리케이션 소스 코드를 복사합니다.
COPY frontend .

# 애플리케이션을 빌드합니다.
RUN npm run build

# 빌드된 정적 파일을 /app/build로 복사
COPY --from=build /app/build /app/build

# server.js 파일을 복사합니다.
COPY server.js .

# 애플리케이션을 실행합니다.
CMD ["node", "server.js"]
