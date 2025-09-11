import eslint from "@eslint/js";
import vueI18n from "@intlify/eslint-plugin-vue-i18n";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  { ignores: ["*.d.ts", "**/coverage", "**/dist"] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs["flat/recommended"],
      ...vueI18n.configs.recommended,
    ],
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      "@intlify/vue-i18n/no-unused-keys": [
        "error",
        {
          extensions: [".ts", ".vue"],
        },
      ],
    },
    settings: {
      "vue-i18n": {
        localeDir: "./src/locales/*.{json,json5,yaml,yml}",
        messageSyntaxVersion: "^11.0.0",
      },
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettier,
);
