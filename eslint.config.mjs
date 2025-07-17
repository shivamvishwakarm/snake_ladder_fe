import { fileURLToPath } from "url";
import { dirname } from "path";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add custom global overrides here
  {
    rules: {
      // Disable React Hook exhaustive deps warning
      "react-hooks/exhaustive-deps": "off",

      // Disable TypeScript explicit any errors
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
