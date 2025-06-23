// src/services/erc721Subscriber.js
const { ethers } = require("ethers");

const ERC721_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

/**
 * Transfer 이벤트 구독
 * @param {ethers.providers.Provider} provider
 * @param {string} contractAddress
 * @param {function} callback
 */
function subscribeToTransfer(provider, contractAddress, callback) {
  console.log(
    `[ERC721Subscriber] ${contractAddress} Transfer 이벤트 구독 시작…`
  );

  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);

  // ————— 실시간 구독 —————
  contract.on("Transfer", async (from, to, tokenId, payload) => {
    const txHash = payload.log.transactionHash;
    const blockNumber = payload.log.blockNumber;

    console.log(
      `[Transfer] from ${from} to ${to}, tokenId ${tokenId.toString()}, ${txHash}, ${blockNumber}`
    );
    let uri = null;
    try {
      uri = await contract.tokenURI(tokenId);
    } catch (err) {
      console.warn("tokenURI 조회 실패:", err.message);
    }

    callback({
      from,
      to,
      tokenId: tokenId.toString(),
      tokenURI: uri,
      txHash,
      blockNumber,
    });
  });

  // 이벤트 리스너 추가 직후에 listenerCount 체크
  contract
    .listenerCount("Transfer")
    .then((count) => console.log(`[DEBUG] listenerCount after on:`, count))
    .catch((err) => console.error("[DEBUG] listenerCount error:", err));
}

module.exports = { subscribeToTransfer };
