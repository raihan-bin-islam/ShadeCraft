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
      // Disable base rule to avoid duplicate errors
      "no-unused-vars": "off",
      // Change from "error" to "warn"
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;
