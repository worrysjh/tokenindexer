# 1. Node.js 베이스 이미지 사용
FROM node:22

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 전체 프로젝트 복사
COPY . .

# 5. 환경 변수 파일 (.env)이 필요하면 이 시점에서 COPY하거나 volume 마운트하세요
# COPY .env .env

# 6. 앱 실행 (예: src/index.js 기준으로)
CMD ["node", "src/index.js"]
