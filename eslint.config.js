import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Define file extensions and general configuration
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest", // Set the ECMAScript version
      sourceType: "module", // Enable ES modules
      globals: globals.browser, // Include browser-specific globals
    },
  },

  // JavaScript recommended rules
  pluginJs.configs.recommended,

  // React recommended rules
  pluginReact.configs.flat.recommended,

  // JSX Accessibility rules
  {
    plugins: {
      "jsx-a11y": pluginJsxA11y,
    },
    rules: {
      ...pluginJsxA11y.configs.recommended.rules,
       "react/prop-types": "off"
    },
  },

  // Additional React settings
  {
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Disable React in scope rule for new JSX transforms
    },
  },
];
