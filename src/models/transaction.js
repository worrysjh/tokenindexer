// transactions 테이블 CRUD
const db = require("../db");

async function createTransaction({
  txHash,
  blockNumber,
  eventType,
  tokenId,
  from,
  to,
  contractAddress,
}) {
  const text = `
    INSERT INTO transactions (tx_hash, block_number, event_type, token_id, from_address, to_address, contract_address)
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    ON CONFLICT (tx_hash) DO NOTHING 
    RETURNING *;
    `;

  const values = [
    txHash,
    blockNumber,
    eventType,
    tokenId,
    from.toLowerCase(),
    to.toLowerCase(),
    contractAddress.toLowerCase(),
  ];
  const res = await db.query(text, values);
  return res.rows[0];
}

module.exports = { createTransaction };
