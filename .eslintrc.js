module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "eqeqeq": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/return-await": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"]
  }
};
