// eslint-disable-next-line no-undef
module.exports = {
	'env': {
		'es2020': true,
		'node': true,
	},
	'parser': 'babel-eslint',
	'parserOptions': {
		'sourceType': 'module',
		'ecmaVersion': 11,
		'ecmaFeatures': {
			'impliedStrict': true,
		},
	},
	'extends': 'eslint:recommended',
	'rules': {
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		'comma-dangle': ['warn', 'always-multiline'],
		'max-len': [2, { 'code': 200, 'tabWidth': 2, 'ignoreUrls': true }],
		'linebreak-style': ['error', 'windows'],
	},
};
