module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ["eslint:recommended", "plugin:react/recommended"],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["react"],
	rules: {
		indent: ["warn", "tab"],
		quotes: ["warn", "double"],
		semi: ["warn", "always"],
		"no-unused-vars": "warn",
		"react/forbid-prop-types": 0,
	},
};
