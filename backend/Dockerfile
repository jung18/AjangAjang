# 베이스 이미지로 Java 17을 사용합니다.
FROM openjdk:17-jdk-slim

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 타임존을 설정합니다.
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 빌드 컨텍스트의 app.jar 파일을 복사합니다.
COPY app.jar /app/app.jar

# 컨테이너 실행 시 실행될 명령어를 설정합니다.
ENTRYPOINT ["java", "-jar", "app.jar"]

# 애플리케이션이 사용할 포트를 노출합니다.
EXPOSE 8080