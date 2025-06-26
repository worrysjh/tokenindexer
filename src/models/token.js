// tokens 테이블 CRUD
const db = require("../db");

async function upsertToken(tokenId, contractAddress, owner, tokenURI) {
  const text = `
    INSERT INTO tokens(token_id, contract_address, owner, token_uri)
    VALUES($1, $2, $3, $4)
    ON CONFLICT(contract_address, token_id)
    DO UPDATE SET owner = EXCLUDED.owner, token_uri = EXCLUDED.token_uri, updated_at = NOW()
    RETURNING *;
    `;

  const values = [
    contractAddress.toLowerCase(),
    tokenId,
    owner.toLowerCase(),
    tokenURI,
  ];
  const res = await db.query(text, values);
  return res.rows[0];
}

async function getToken(target) {
  const text = "SELECT * FROM tokens WHERE token_id = $1 OR owner = $1";
  const res = await db.query(text, [target]);
  return res.rows;
}

module.exports = { upsertToken, getToken };
