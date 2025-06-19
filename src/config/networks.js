require("dotenv").config();

const networks = {
  ethereum: {
    name: "Ethereum Mainnet",
    rpcUrl: process.env.ETHEREUM_RPC,
  },
  polygon: {
    name: "Polygon",
    rpcUrl: process.env.POLYGON_RPC,
  },
};

module.exports = networks;
