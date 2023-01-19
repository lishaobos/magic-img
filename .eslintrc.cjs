module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	root: true,
	rules: {
		"@typescript-eslint/indent": ['error', 'tab'],
		'@typescript-eslint/semi': ['error', 'never'],
	}
}