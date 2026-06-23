const { searchCode, fetchFile } = require("./githubClient");
const { analyze } = require("./iocEngine");
const store = require("./repoStore");
const { evaluate } = require("./evaluator");
const { BASE_KEYWORDS, EXCLUDE_PATHS, ALERT_THRESHOLD, CYCLE_SLEEP } = require("./config");
const { log } = require("./logger");

function isExcluded(path) {
  return EXCLUDE_PATHS.some(x => path.includes(x));
}

async function runCycle() {
  log({ event: "cycle_start" });

  for (const keyword of BASE_KEYWORDS) {
    const results = await searchCode(keyword);

    for (const item of results) {

      if (isExcluded(item.path)) continue;

      const content = await fetchFile(item.html_url);
      if (!content) continue;

      const result = analyze(content);

      store.update(item.repository.full_name, result);
    }
  }

  await evaluate(store.getAll(), ALERT_THRESHOLD);
  store.clear();

  log({ event: "cycle_complete" });
}

async function start() {
  log({ event: "engine_started" });

  while (true) {
    try {
      await runCycle();
      await new Promise(r => setTimeout(r, CYCLE_SLEEP));
    } catch (e) {
      log({ event: "worker_error", error: e.message });
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

module.exports = { start };
