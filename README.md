# 🪙 Token Indexer

> 여러 블록체인 네트워크에서 ERC721 토큰 정보를 수집하고, PostgreSQL에 저장하여 사용자로 하여금 검색·조회할 수 있도록 하는 Node.js 기반 백엔드 애플리케이션입니다.

---

## 🚀 주요 기능

- ✅ ERC721 토큰의 `tokenId`, `owner`, `tokenURI` 정보 수집
- ✅ Transfer 이벤트 이력 조회 (`Transfer(from, to, tokenId)`)
- ✅ Infura를 통한 Ethereum 메인넷 RPC 접근
- ✅ PostgreSQL에 데이터 저장 예정
- ✅ 네트워크 및 컨트랙트 주소별 수집 지원
- ✅ 향후 메타데이터(JSON) 파싱 및 검색 API 구현 가능

---

## 📁 프로젝트 구조

```
tokenindexer/
├── src/
│ ├── config/           # 네트워크 설정
│ ├── services/         # 블록체인 정보 수집 로직
│ ├── db/               # DB 연결 및 쿼리
│ ├── testTransfer.js   # Transfer 이벤트 테스트
│ └── index.js          # 진입점 (또는 실행 스크립트)
├── .env                # 비공개 환경변수 파일 (추적 제외)
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠 사용 기술

- **Node.js**
- **ethers.js** – 스마트 컨트랙트 호출
- **PostgreSQL** – 토큰 정보 저장
- **dotenv** – 환경변수 관리
- **Infura** – 블록체인 RPC provider

---

## ⚙️ 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone https://github.com/yourusername/tokenindexer.git
cd tokenindexer
```

### 2. 의존성 설치

```bash
npm install
npm install express ethers dotenv pg
```

### 3. 환경변수 파일 설정

```bash
ETHEREUM_RPC=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
DATABASE_URL=postgresql://user:pass@localhost:5432/tokenindexer
```
