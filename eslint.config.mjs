import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jest from "eslint-plugin-jest";
import _import from "eslint-plugin-import";
import tsdoc from "eslint-plugin-tsdoc";
import prettier from "eslint-plugin-prettier";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/*.css",
        "**/*.scss",
        "**/*.less",
        "**/*.json",
        "src/components/CheckIn/tagTemplate.ts",
        "**/package.json",
        "**/package-lock.json",
        "**/tsconfig.json",
    ],
}, ...compat.extends(
    "plugin:react/recommended",
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier",
    "prettier",
), {
    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
        jest,
        import: fixupPluginRules(_import),
        tsdoc,
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "react/destructuring-assignment": "error",
        "@typescript-eslint/explicit-module-boundary-types": "error",

        "react/no-multi-comp": ["error", {
            ignoreStateless: false,
        }],

        "react/jsx-filename-extension": ["error", {
            extensions: [".tsx"],
        }],

        "import/no-duplicates": "error",
        "tsdoc/syntax": "error",
        "@typescript-eslint/ban-ts-comment": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/no-unsafe-function-type": "error",
        "@typescript-eslint/no-wrapper-object-types": "error",
        "@typescript-eslint/no-empty-object-type": "error",
        "@typescript-eslint/no-duplicate-enum-values": "error",
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/consistent-type-imports": "error",

        "@typescript-eslint/explicit-function-return-type": [2, {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
        }],

        camelcase: "off",

        "@typescript-eslint/naming-convention": ["error", {
            selector: "interface",
            format: ["PascalCase"],
            prefix: ["Interface", "TestInterface"],
        }, {
            selector: ["typeAlias", "typeLike", "enum"],
            format: ["PascalCase"],
        }, {
            selector: "typeParameter",
            format: ["PascalCase"],
            prefix: ["T"],
        }, {
            selector: "variable",
            format: ["camelCase", "UPPER_CASE", "PascalCase"],
            leadingUnderscore: "allow",
        }, {
            selector: "parameter",
            format: ["camelCase"],
            leadingUnderscore: "allow",
        }, {
            selector: "function",
            format: ["camelCase", "PascalCase"],
        }, {
            selector: "memberLike",
            modifiers: ["private"],
            format: ["camelCase"],
            leadingUnderscore: "require",
        }, {
            selector: "variable",
            modifiers: ["exported"],
            format: null,
        }],

        "react/jsx-pascal-case": ["error", {
            allowAllCaps: false,
            allowNamespace: false,
        }],

        "react/jsx-equals-spacing": ["warn", "never"],
        "react/no-this-in-sfc": "error",
        "jest/expect-expect": 0,

        "react/no-unstable-nested-components": ["error", {
            allowAsProps: true,
        }],

        "react/function-component-definition": [0, {
            namedComponents: "function-declaration",
        }],

        "prettier/prettier": "error",
    },
}];