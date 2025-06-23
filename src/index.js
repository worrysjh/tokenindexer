// Application 비즈니스 로직
const { ethers } = require("ethers");
const db = require("./db");
const networks = require("./config/networks");
const { subscribeToTransfer } = require("./services/erc721Subscriber");
const { saveTransferEvent } = require("./services/tokenProcessor");

/**
 * 실행 함수
 * @param {{contract: string, network: string}} options
 */

const subscribed = new Set();

async function run({ contract, network }) {
  try {
    // 1) DB 연결 확인
    const res = await db.query("SELECT NOW()");
    console.log("DB 연결 성공:", res.rows[0]);

    // 2) provider 선택
    const provider = networks[network];

    if (!provider) {
      console.error(`네트워크 '${network}'가 구성되어 있지 않습니다.`);
      process.exit(1);
    }

    const ws = provider._websocket || provider.websocket;
    console.log("Provider WebSocket URL:", ws?.url);

    if (ws) {
      ws.on("open", () => {
        console.log(`[${network}] WS 연결 성공`);
        console.log(`${contract} 구독 준비 완료`);
      });
      ws.on("error", (err) => {
        console.error("WS 에러: ", err.message);
      });
    } else {
      console.warn("WebSocket 객체를 찾을 수 없습니다.");
    }
    /** 
    provider.on("block", (blockNumber) => {
      console.log("새 블록: ", blockNumber);
    });
*/
    const contracts = Array.isArray(contract) ? contract : [contract];
    for (const addr of contracts) {
      subscribeToTransfer(provider, contract, async (data) => {
        console.log("Transfer 이벤트:", data);
        try {
          await saveTransferEvent(data, contract, network);
          console.log("이벤트 DB 저장 완료:", data.tokenId);
        } catch (err) {
          console.error("이벤트 DB 저장 실패:", err);
        }
      });

      subscribed.add(addr);
      console.log(`총 구독 중인 컨트랙트: ${subscribed.size}개`);
    }

    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log(
      "추가 구독하려면 컨트랙트 주소를 입력하세요. 종료하려면 'exit'입력."
    );

    readline.on("line", (line) => {
      const addr = line.trim();
      if (addr.toLowerCase() === "exit") {
        console.log("종료합니다.");
        process.exit(0);
      }
      // 간단한 주소 유효성 검사
      if (!ethers.isAddress(addr)) {
        console.warn("잘못된 주소입니다: ", addr);
        return;
      }
      console.log(`런타임 추가 구독: ${addr}`);
      subscribeToTransfer(provider, addr, async (data) => {
        await saveTransferEvent(data, addr, network);
        console.log("이벤트 DB 저장 완료: ", data.tokenId);
      });

      subscribed.add(addr);
      console.log(`총 구독 중인 컨트랙트: ${subscribed.size}개`);
    });
  } catch (err) {
    console.error("실행 중 오류 발생: ", err);
    process.exit(1);
  }
}

module.exports = run;
