const WEIGHTS = {
  FUNCTION_HIGH: 12,
  FUNCTION_MED: 7,
  CONFIG_KEY: 5,
  ADDRESS: 20,
  GENERIC: 2
};

const IOC_RULES = [
  { type: "function", weight: WEIGHTS.FUNCTION_HIGH, patterns: [
    "sendMessHandler",
    "addApproveHandler",
    "compareWorth",
    "seaportTesting"
  ]},

  { type: "config", weight: WEIGHTS.CONFIG_KEY, patterns: [
    "connectButton",
    "messageButton",
    "startButton",
    "repeatHighest"
  ]},

  { type: "crypto", weight: WEIGHTS.FUNCTION_MED, patterns: [
    "eth_signTypedData_v4",
    "Seaport",
    "OrderComponents"
  ]},

  { type: "address", weight: WEIGHTS.ADDRESS, patterns: [
    /0x[a-fA-F0-9]{40}/g
  ]}
];

function normalize(text) {
  return text.toLowerCase();
}

function analyze(content) {
  const text = normalize(content);

  let score = 0;
  let matches = [];
  let categories = new Set();

  for (const rule of IOC_RULES) {
    for (const p of rule.patterns) {

      if (p instanceof RegExp) {
        const found = content.match(p);
        if (found) {
          score += rule.weight;
          matches.push(...found.slice(0, 3));
          categories.add(rule.type);
        }
      } else {
        const pLower = p.toLowerCase();
        if (text.includes(pLower)) {
          score += rule.weight;
          matches.push(p);
          categories.add(rule.type);
        }
      }
    }
  }

  return {
    score,
    matches,
    categories: [...categories]
  };
}

module.exports = { analyze };
