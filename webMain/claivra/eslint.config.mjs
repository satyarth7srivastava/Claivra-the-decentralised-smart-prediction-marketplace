import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "no-unused-vars": "off",
      "no-var": "off",
      "@next/next/no-img-element": "off",
      "react/jsx-key": "off",
      "@next/next/no-html-link-for-pages": "off",
      "prefer-const": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    },
  },
];

export default eslintConfig;
