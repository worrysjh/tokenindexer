// Application 비즈니스 로직
const { ethers } = require("ethers");
const db = require("./db");
const networks = require("./config/networks");
const { subscribeToTransfer } = require("./services/erc721Subscriber");
const { saveTransferEvent } = require("./services/tokenProcessor");
const { searchTokenByTarget } = require("./services/searchToken");
const readline = require("readline");

const contractList = new Set();

let reconnectAttempt = 0;
let provider;

// 1) 연결 생성 함수
function initWebSocket(network) {
  provider = networks[network];
  if (!provider) {
    console.error(`네트워크 '${network}'가 구성되지 않았습니다.`);
    process.exit(1);
  }
  const ws = provider._websocket || provider.websocket;

  ws.on("open", () => {
    console.log(`[${network}] WS 연결 성공 (시도 #${reconnectAttempt})`);
    reconnectAttempt = 0; // 성공시 카운터 리셋
    // 구독 재등록 로직 호출
    resubscribeAll(network);
  });

  ws.on("error", (err) => {
    console.error("WS 에러: ", err.message);
    // 에러가 발생해도 거의 곧바로 close 발생, 여기서도 재접속 예약
    scheduleReconnect(network);
  });

  ws.on("close", (code, reason) => {
    console.warn(`WS 연결 종료 (code=${code}, reason=${reason})`);
    scheduleReconnect(network);
  });
}

// 2) 재접속 스케줄링
function scheduleReconnect(network) {
  reconnectAttempt++;
  const delay = Math.min(1000 * 2 ** reconnectAttempt, 30_000);
  console.log(`${delay}ms 후에 재접속을 시도합니다...`);
  setTimeout(() => initWebSocket(network), delay);
}

// 3) 구독(또는 재구독) 모듈
function resubscribeAll() {
  for (const addr of contractList) {
    console.log(`(재)구독: ${addr}`);
    subscribeToTransfer(provider, addr, async (data) => {
      await saveTransferEvent(data, addr, network);
    });
  }
}

// 4) 초기 실행
async function run({ contract, network }) {
  // 1. DB 연결 확인
  try {
    const { rows } = await db.query("SELECT NOW()");
    console.log("DB 연결 성공: ", rows[0]);
  } catch (err) {
    console.error("DB 연결 실패: ", err);
    process.exit(1);
  }

  // 2. WebSocket 연결 및 구독 초기화
  initWebSocket(network);

  // 3. 초기 구독 주소 등록
  const initial = Array.isArray(contract) ? contract : [contract];
  initial.forEach((addr) => contractList.add(addr.toLowerCase()));

  // 4) 런타임에 주소 추가 구독
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(
    `=============================
>> 추가 구독하려면 컨트랙트 주소를 입력하세요.
>> 구독항목을 확인하려면 'list' 입력.
>> 토큰검색을 진행하려면 'search' 입력.
>> 종료하려면 'exit' 입력.
==============================`
  );
  let isSearching = false;

  rl.on("line", async (line) => {
    const input = line.trim();
    let count = 1;

    // 검색모드 변환
    if (input.toLowerCase() === "search") {
      console.log("토큰검색 | 검색할 토큰ID / 소유자 주소 입력:");
      isSearching = true;
      return;
    }
    // 검색
    if (isSearching) {
      console.log("입력값: ", input);
      isSearching = false;
      await searchTokenByTarget(input);
      return;
    }
    const addr = input.toLowerCase();
    // 종료
    if (addr === "exit") {
      console.log("종료합니다.");
      process.exit(0);
    }
    // 모든 구독 중인 컨트랙트 조회
    if (addr === "list") {
      console.log("현재 구독 중인 컨트랙트 목록");
      if (contractList.size === 0) {
        console.log("> 현재 구동 중인 컨트랙트가 없습니다.");
      } else {
        for (const addr of contractList) {
          console.log(`${count}.`, addr);
          count++;
        }
      }
      count = 1;
      return;
    }

    contractList.add(addr);
    console.log(`총 구독 중인 컨트랙트: ${contractList.size}개`);

    // 즉시 추가 구독
    if (provider._websocket?.readyState === 1) {
      console.log(`런타임 구독: ${addr}`);
      subscribeToTransfer(provider, addr, async (data) => {
        await saveTransferEvent(data, addr, network);
      });
    }

    // 주소 유효성 검사
    if (!ethers.isAddress(addr)) {
      console.warn("잘못된 주소입니다: ", addr);
      return;
    }
  });
}

module.exports = run;
