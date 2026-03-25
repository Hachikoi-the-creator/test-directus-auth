/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2015, // or "latest" for newest features
    project: true,
  },
  overrides: [
    {
      files: ["my/image/loader.js"],
      parser: "espree", // Use regular JavaScript parser
      extends: ["eslint:recommended"], // Use regular ESLint rules
    },
  ],
  plugins: ["@typescript-eslint"],
  extends: ["next/core-web-vitals"],

  rules: {
    "react-hooks/exhaustive-deps": "off",
    // These opinionated rules are enabled in stylistic-type-checked above.
    // Feel free to reconfigure them to your own preference.
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["off", {}],
    "react/no-unescaped-entities": "off",
  },
};

module.exports = config;
