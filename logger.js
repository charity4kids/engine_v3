function log(obj) {
  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    ...obj
  }));
}

module.exports = { log };
