import antfu from '@antfu/eslint-config';

export default antfu({
	formatters: true,
	stylistic: {
		indent: 'tab',
		maxLineLength: 100,
		singleQuote: true,
		trailingComma: 'all',
		semi: true,
		jsx: true,
	},
	rules: {
		'style/operator-linebreak': 'off',
		'style/brace-style': 'off',
		'style/arrow-parens': 'off',
	},
	react: true,
	ignores: ['**/*.md', '**/convex/_generated/*'],
});
