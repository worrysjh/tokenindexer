const { getToken } = require("../models/token");

/**
 * target값에 해당하는 token_id 또는 owner 주소를 검색 및 출력
 * @param {string} target - 검색할 값(token_id / owner)
 */
async function searchTokenByTarget(target) {
  console.log("타겟값: ", target);
  try {
    const res = await getToken(target);
    console.log(res);
    if (!res || res.length === 0) {
      console.log("해당하는 토큰ID/사용자 주소의 토큰이 없습니다.");
    } else {
      console.log(`${target} 관련 토큰 정보: `);
      for (const row of res) {
        console.log(
          `* tokenId: ${row.token_id}, owner: ${row.owner}, token_uri: ${row.token_uri}`
        );
      }
    }
  } catch (err) {
    console.error("DB 조회 중 오류 발생", err);
  }
  console.log("* 검색모드 종료");
}

module.exports = { searchTokenByTarget };
