import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    // TanStack Table's `useReactTable()` returns functions the React Compiler
    // cannot memoize, and the library exposes no compiler-friendly alternative
    // (unlike react-hook-form's `watch()`, which we replaced with `useWatch()`
    // elsewhere). Scope the advisory off to the data-table components only so
    // it still guards the rest of the codebase.
    files: ["**/*DataTable.tsx"],
    rules: {
      "react-hooks/incompatible-library": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/api/**",
  ]),
]);

export default eslintConfig;
