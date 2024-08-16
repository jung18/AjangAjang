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

# 두 번째 스테이지: 실제 실행 환경.
FROM node:20-alpine

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# build 스테이지에서 node_modules를 복사합니다.
COPY --from=build /app/node_modules /app/node_modules

# build 스테이지에서 빌드된 파일들을 복사합니다.
COPY --from=build /app/build /app/frontend/build

# server.js 파일을 복사합니다.
COPY frontend/server.js .

# 애플리케이션을 실행합니다.
CMD ["node", "server.js"]
