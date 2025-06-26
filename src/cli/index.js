// CLI 옵션 파싱 및 실행 호출
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const run = require("../index");
const contractList = require("../config/contracts");

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 --contract <address> [--network <name>]")
  .option("network", {
    alias: "n",
    type: "string",
    describe: "사용할 네트워크 (ethereum)",
    default: "ethereum",
    demandOption: true,
  })
  .option("shard", {
    type: "number",
    demandOption: true,
  })
  .option("totalShards", {
    type: "number",
    demandOption: true,
  })
  .help()
  .alias("help", "h").argv;

console.log("CLI 파라미터:", argv);

run({
  contract: contractList,
  network: argv.network,
  shard: argv.shard,
  totalShards: argv.totalShards,
});
