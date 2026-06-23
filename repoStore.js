const repos = new Map();

function update(repo, result) {
  if (!repos.has(repo)) {
    repos.set(repo, {
      score: 0,
      files: 0,
      matches: new Set(),
      categories: new Set()
    });
  }

  const r = repos.get(repo);

  r.score += result.score;
  r.files += 1;

  result.matches.forEach(m => r.matches.add(m));
  result.categories = new Set([...r.categories, ...result.categories]);
}

function getAll() {
  return repos;
}

function clear() {
  repos.clear();
}

module.exports = { update, getAll, clear };
