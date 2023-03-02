import globals from "globals";
import jsEslint from "@eslint/js";
import tslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  jsEslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.js", "**/*.cjs", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest" },
    },
    plugins: { "@typescript-eslint": tslint },
    rules: {
      "array-bracket-newline": ["error", { multiline: true }],
      "array-bracket-spacing": ["error", "never"],
      "array-element-newline": ["error", "consistent"],
      "arrow-body-style": ["error", "as-needed"],
      "arrow-spacing": "error",
      "block-scoped-var": "error",
      "block-spacing": "error",
      "brace-style": ["error", "1tbs"],
      camelcase: "error",
      "comma-spacing": "error",
      "comma-style": "error",
      complexity: ["error", 10],
      "computed-property-spacing": "error",
      "default-case-last": "error",
      "default-param-last": "error",
      "dot-location": ["error", "property"],
      "dot-notation": "error",
      "eol-last": ["error", "always"],
      eqeqeq: "error",
      "func-call-spacing": ["error", "never"],
      "function-call-argument-newline": ["error", "consistent"],
      "generator-star-spacing": ["error", "after"],
      "grouped-accessor-pairs": "error",
      indent: [
        "error",
        2,
        { SwitchCase: 1, ignoredNodes: ["TemplateLiteral > *"] },
      ],
      "key-spacing": "error",
      "keyword-spacing": "error",
      "logical-assignment-operators": "error",
      "max-depth": ["error", 4],
      "max-lines": ["error", 500],
      "max-lines-per-function": "error",
      "max-nested-callbacks": ["error", 3],
      "max-params": ["error", 4],
      "max-statements": "error",
      "new-cap": ["error", { capIsNew: false }],
      "new-parens": "error",
      "newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],
      "no-array-constructor": "error",
      "no-caller": "error",
      "no-constant-binary-expression": "error",
      "no-constructor-return": "error",
      "no-continue": "error",
      "no-delete-var": "error",
      "no-duplicate-imports": "error",
      "no-else-return": "error",
      "no-empty-function": "error",
      "no-empty-static-block": "error",
      "no-eq-null": "error",
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-extra-label": "error",
      "no-extra-parens": ["error", "all", { nestedBinaryExpressions: false }],
      "no-floating-decimal": "error",
      "no-implicit-coercion": "error",
      "no-implicit-globals": "error",
      "no-implied-eval": "error",
      "no-iterator": "error",
      "no-labels": "error",
      "no-lone-blocks": "error",
      "no-loop-func": "error",
      "no-magic-numbers": [
        "off",
        { ignore: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      ],
      "no-mixed-operators": "error",
      "no-multi-assign": "error",
      "no-multi-spaces": "error",
      "no-multi-str": "error",
      "no-multiple-empty-lines": ["error", { max: 2 }],
      "no-negated-condition": "error",
      "no-nested-ternary": "error",
      "no-new": "error",
      "no-new-func": "error",
      "no-new-object": "error",
      "no-new-wrappers": "error",
      "no-param-reassign": "error",
      "no-promise-executor-return": "error",
      "no-proto": "error",
      "no-return-assign": "error",
      "no-return-await": "error",
      "no-script-url": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-shadow": "error",
      "no-tabs": "error",
      "no-throw-literal": "error",
      "no-trailing-spaces": "error",
      "no-undef-init": "error",
      "no-undefined": "error",
      "no-underscore-dangle": "error",
      "no-unneeded-ternary": "error",
      "no-unreachable-loop": "error",
      "no-unused-expressions": "error",
      "no-unused-private-class-members": "error",
      "no-unused-vars": "error",
      "no-use-before-define": "error",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "no-useless-constructor": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "no-var": "error",
      "no-void": "error",
      "no-whitespace-before-property": "error",
      "object-curly-spacing": ["error", "always"],
      "object-property-newline": [
        "error",
        { allowAllPropertiesOnSameLine: true },
      ],
      "object-shorthand": "error",
      "one-var": ["error", "never"],
      "operator-assignment": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-destructuring": "error",
      "prefer-exponentiation-operator": "error",
      "prefer-named-capture-group": "error",
      "prefer-numeric-literals": "error",
      "prefer-object-has-own": "error",
      "prefer-object-spread": "error",
      "prefer-promise-reject-errors": "error",
      "prefer-regex-literals": "error",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "prefer-template": "error",
      quotes: ["error", "double", { avoidEscape: true }],
      radix: "error",
      "require-atomic-updates": "error",
      "require-await": "error",
      "require-unicode-regexp": "error",
      "rest-spread-spacing": ["error", "never"],
      semi: ["error", "always"],
      "semi-spacing": ["error", { after: true, before: false }],
      "semi-style": ["error", "last"],
      "sort-imports": ["error", { ignoreCase: true }],
      "sort-keys": "error",
      "space-before-blocks": ["error", "always"],
      "space-before-function-paren": [
        "error",
        { anonymous: "never", asyncArrow: "always", named: "never" },
      ],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      "space-unary-ops": "error",
      "spaced-comment": "error",
      "switch-colon-spacing": "error",
      "template-curly-spacing": "error",
      "template-tag-spacing": "error",
      "unicode-bom": ["error", "never"],
      "wrap-iife": ["error", "inside"],
    },
  },
  { ignores: ["_site/**"] },
];
