// testSave.js
require("dotenv").config();
const { saveTransferEvent } = require("./src/services/tokenProcessor");

(async () => {
  const dummy = {
    from: "0x0000000000000000000000000000000000000001",
    to: "0x0000000000000000000000000000000000000002",
    tokenId: "42",
    tokenURI: "https://example.com/42.json",
    txHash:
      "0xabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca",
    blockNumber: 123456,
  };
  await saveTransferEvent(
    dummy,
    "0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF",
    "ethereum"
  );
  console.log("✅ testSave: 완료");
  process.exit(0);
})().catch((e) => {
  console.error("❌ testSave 에러", e);
  process.exit(1);
});
