// contracts 테이블 CRUD
const db = require("../db");

async function createContract(address, network) {
  let res;
  const text = `
    INSERT INTO contracts(address, network)
    VALUES($1, $2)
    ON CONFLICT(address) DO NOTHING
    RETURNING *;
    `;

  const values = [address.toLowerCase(), network];
  try {
    res = await db.query(text, values);
    console.log("createContract 결과:", res.rows);
  } catch (err) {
    console.error("createContract 결과:", err);
  }
  return res.rows[0];
}

async function getContractByAddress(address) {
  const text = "SELECT * FROM contracts WHERE address = $1";
  const res = await db.query(text, [address.toLowerCase]);
  return res.rows[0];
}

module.exports = { createContract, getContractByAddress };
