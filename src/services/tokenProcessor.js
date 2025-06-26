// 이벤트 수신 후 데이터베이스 저장
const { createContract } = require("../models/contract");
const { upsertToken } = require("../models/token");
const { createTransaction } = require("../models/transaction");

/**
 * Transfer 이벤트를 DB에 저장
 */
async function saveTransferEvent(
  { from, to, tokenId, tokenURI, txHash, blockNumber },
  contractAddress,
  network
) {
  // contracts 테이블에 등록
  // await createContract(contractAddress, network);

  // tokens 테이블에 삽입/업데이트
  await upsertToken(contractAddress, tokenId, to, tokenURI);

  // transactions 테이블에 삽입
  await createTransaction({
    txHash,
    blockNumber,
    eventType: "Transfer",
    tokenId,
    from,
    to,
    contractAddress,
  });
}

module.exports = { saveTransferEvent };
