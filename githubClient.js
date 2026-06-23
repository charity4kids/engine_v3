const axios = require("axios");
const { GITHUB_TOKEN, RATE_LIMIT_SLEEP } = require("./config");

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function searchCode(query) {
  try {
    const res = await axios.get(
      `https://api.github.com/search/code?q=${encodeURIComponent(query)}+in:file&per_page=25`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "User-Agent": "soc-intel-engine-v3"
        }
      }
    );

    return res.data.items || [];
  } catch (e) {
    if (e.response?.status === 403) {
      await sleep(RATE_LIMIT_SLEEP);
    }
    return [];
  }
}

async function fetchFile(url) {
  try {
    const raw = url
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/");

    const res = await axios.get(raw, { maxContentLength: 750000 });
    return res.data;
  } catch {
    return null;
  }
}

module.exports = { searchCode, fetchFile };
