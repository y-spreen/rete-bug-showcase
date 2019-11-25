module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_+$" }]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
