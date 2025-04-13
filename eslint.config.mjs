import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";

export default tseslint.config([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    extends: [react.configs.flat.recommended],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // Disable prop-types as we're using TypeScript
    },
    settings: {
      react: {
        version: "18.2.0", // Specify React version
      },
    },
  },
  hooks.configs["recommended-latest"],
]);
