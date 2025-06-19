const { ethers } = require("ethers");

// ERC721에서 ownerOf, tokenURI를 호출할 최소 ABI
const ERC721_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

/**
 * 특정 네트워크에서 특정 ERC721 토큰 정보를 조회
 */
async function fetchERC721Info(rpcUrl, contractAddress, tokenId) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);

  try {
    const id = BigInt(tokenId).toString();
    const [owner, tokenURI] = await Promise.all([
      contract.ownerOf(id),
      contract.tokenURI(id),
    ]);

    return {
      tokenId,
      owner,
      tokenURI,
    };
  } catch (err) {
    console.error(
      `Failed to fetch token ${tokenId} from ${contractAddress}:`,
      err.message
    );
    return null;
  }
}

module.exports = { fetchERC721Info };
