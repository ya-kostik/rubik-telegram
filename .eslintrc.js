module.exports = {
  "parser": "babel-eslint",
  "env": {
    "es6": true,
    "node": true
  },
  "extends": ["eslint:recommended"],
  "rules": {
      "no-console": ["error", { "allow": ["warn", "error", "info", "dir", "time", "timeEnd"] }],
      "no-cond-assign": [0, "except-parens"],
      "require-yield": [1]
  },
  "globals": { window: true, fetch: true }
}
