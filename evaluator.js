const pool = require("./db");
const sendTelegram = require("./telegram");

const alerted = new Map();

function shouldAlert(repo, data, threshold) {
  const uniqueIOC = data.matches.size;
  const categoryScore = data.categories.size;

  return data.score >= threshold && uniqueIOC >= 3 && categoryScore >= 2;
}

async function evaluate(repos, threshold) {
  const now = Date.now();

  for (const [repo, data] of repos.entries()) {

    if (!shouldAlert(repo, data, threshold)) continue;

    if (alerted.has(repo)) {
      if (now - alerted.get(repo) < 6 * 60 * 60 * 1000) continue;
    }

    alerted.set(repo, now);

    const repoUrl = `https://github.com/${repo}`;

    await pool.query(
      `INSERT INTO findings (keyword, repo_name, html_url, score, severity)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT DO NOTHING`,
      ["soc-v3-ioc", repo, repoUrl, data.score, "HIGH"]
    );

    await sendTelegram(
`SOC ALERT v3
Repo: ${repo}
Score: ${data.score}
Link: ${repoUrl}`
    );
  }
}

module.exports = { evaluate };
