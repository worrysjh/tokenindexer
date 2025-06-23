// CLI 옵션 파싱 및 실행 호출
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const run = require("../index");

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 --contract <address> [--network <name>]")
  .option("contract", {
    alias: "c",
    type: "string",
    describe: "구독할 ERC721 컨트랙트 주소",
    demandOption: true,
  })
  .option("network", {
    alias: "n",
    type: "string",
    describe: "사용할 네트워크 (ethereum)",
    default: "ethereum",
  })
  .help()
  .alias("help", "h").argv;

run({ contract: argv.contract, network: argv.network });
