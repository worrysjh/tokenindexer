require("dotenv").config();
const { WebSocketProvider } = require("ethers");

/**
 * WebSocketProvider 생성
 * @param {string} url
 * @returns {WebSocketProvider|null}
 */
function createProvider(url) {
  if (!url) {
    console.warn("WSS URL이 .env에 설정되어 있지 않습니다");
    return null;
  }
  try {
    return new WebSocketProvider(url);
  } catch (err) {
    console.error("WebSocketProvider 생성 실패: ", err.message);
    return null;
  }
}

module.exports = { ethereum: createProvider(process.env.ETHEREUM_WSS) };
