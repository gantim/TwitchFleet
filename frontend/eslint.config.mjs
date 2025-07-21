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
      // не прерывает компиляцию, но покажет предупреждение
      "@typescript-eslint/no-unused-vars": "warn",

      // временно отключить (или: "warn")
      "@typescript-eslint/no-explicit-any": "off",

      // можно отключить предупреждение о <img>
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
