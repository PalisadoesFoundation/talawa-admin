import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import vitest from "eslint-plugin-vitest";

export default [
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "fix-readme-links.js",
      "fix-repo-url.js",
      "src/components/CheckIn/tagTemplate.ts",
      "docs/**",
      "*.md",
      "docker/docker-compose.prod.yaml",
      "docker/docker-compose.dev.yaml",
      "docker/docker-compose.deploy.yaml",
      "docker/Dockerfile.prod",
      "docker/Dockerfile.dev",
      "docker/Dockerfile.deploy",
      "config/docker/setup/nginx.conf",
      "config/docker/setup/nginx.prod.conf"
    ],
  },
  {
    files: ["*.ts", "*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
      },
    },
    plugins: {
      react,
      "@typescript-eslint": ts,
      vitest,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...prettier.rules,
      "vitest/no-disabled-tests": "warn",
      "vitest/no-focused-tests": "error",
      "vitest/no-identical-title": "error",
      "@typescript-eslint/no-unused-expressions": "error",
    },
  },
  {
    files: ["*.spec.ts", "*.test.ts", "*.spec.tsx", "*.test.tsx"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  },
];
