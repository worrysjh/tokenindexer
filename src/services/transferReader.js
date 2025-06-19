const { ethers } = require("ethers");

const abi = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

async function getTransferEvents(
  rpcUrl,
  contractAddress,
  tokenId,
  fromBlock = 0,
  toBlock = "latest"
) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const filter = contract.filters.Transfer(null, null, tokenId);
  const events = await contract.queryFilter(filter, fromBlock, toBlock);

  return events.map((ev) => ({
    from: ev.args.from,
    to: ev.args.to,
    tokenId: ev.args.tokenId.toString(),
    txHash: ev.transactionHash,
    blockNumber: ev.blockNumber,
  }));
}

module.exports = { getTransferEvents };
