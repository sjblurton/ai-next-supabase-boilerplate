import organizeImports from "prettier-plugin-organize-imports";

const config = {
  plugins: [organizeImports, "prettier-plugin-sort-json"],
  jsonRecursiveSort: false,
  jsonSortOrder: JSON.stringify({ [/.*/]: "lexical" }),
};

export default config;
