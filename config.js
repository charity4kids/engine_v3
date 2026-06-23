require("dotenv").config();

module.exports = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,

  ALERT_THRESHOLD: 25,
  MAX_FILE_SIZE: 750000,

  RATE_LIMIT_SLEEP: 3000,
  CYCLE_SLEEP: 8 * 60 * 1000,

  BASE_KEYWORDS: [
    "connect wallet",
    "seaport",
    "eth_signTypedData",
    "balances_v2",
    "web3modal",
    "nft mint"
  ],

  EXCLUDE_PATHS: [
    "node_modules",
    "dist",
    "build",
    ".min.js",
    "vendor"
  ]
};
