require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Token Indexer is running!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// DB 연결 테스트용 코드
const pool = require("./db");
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB connection failed");
  }
});

// 통신 테스트
const { fetchERC721Info } = require("./services/erc721Reader");
const networks = require("./config/networks");

app.get("/test-erc721", async (req, res) => {
  const network = networks.ethereum;
  const contract = "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e";
  const tokenId = "1";

  const info = await fetchERC721Info(network.rpcUrl, contract, tokenId);
  res.json(info || { error: "Failed to fetch token info" });
});

module.exports = pool;
