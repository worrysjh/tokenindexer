// src/testTransfer.js
require("dotenv").config();
const { getTransferEvents } = require("./services/transferReader");
const networks = require("./config/networks");

(async () => {
  const contractAddress = "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e"; // Doodles
  const tokenId = "1"; // 실제 존재하는 토큰
  const rpcUrl = networks.ethereum.rpcUrl;

  try {
    const events = await getTransferEvents(
      rpcUrl,
      contractAddress,
      tokenId,
      0,
      "latest"
    );
    console.log("✅ Transfer Events:");
    console.log(events);
  } catch (err) {
    console.error("❌ 에러 발생:", err);
  }
})();
