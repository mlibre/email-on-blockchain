module.exports = {
	"env": {
		"commonjs": true,
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:node/recommended"
	],
	"parserOptions": {
		"ecmaVersion": 12
	},
	"rules": {
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"one-var": [
			"error",
			"never"
		],
		"brace-style": [
			"error",
			"allman",
			{
				"allowSingleLine": true
			}
		],
		"arrow-body-style": [
			"error",
			"always"
		],
		"no-template-curly-in-string": [
			"error"
		],
		"prefer-const": [
			"error",
			{
				"destructuring": "any",
				"ignoreReadBeforeAssign": false
			}
		],
		"no-new-object": [
			"error",
		],
		"no-extra-parens": [
			"error",
			"all",
			{
				"conditionalAssign": false
			}
		],
		"no-empty-function": [
			"error",
		],
		"no-empty": [
			"warn",
			{ 
				"allowEmptyCatch": true
			}
		],
		"no-eq-null": [
			"error",
		],
		"no-extra-bind": [
			"error",
		],
		"no-self-compare": [
			"error",
		],
		"no-useless-call": [
			"error",
		],
		"no-undefined": [
			"error",
		],
		"no-undef": [
			"warn",
		],
		"no-array-constructor": [
			"error",
		],
		"prefer-destructuring": [
			"error", {
				"VariableDeclarator": {
					"array": true,
					"object": true
				},
				"AssignmentExpression": {
					"array": false,
					"object": false
				}
			},
			{
				"enforceForRenamedProperties": false
			}
		],
		"object-shorthand": [
			"warn",
		],
		"prefer-spread": [
			"warn",
		],
		"prefer-template": [
			"warn",
		],
		"no-loop-func": [
			"warn",
		],
		"prefer-rest-params": [
			"warn",
		],
		"no-new-func": [
			"warn",
		],
		"space-before-blocks": [
			"warn",
		],
		"function-paren-newline": [
			"warn",
		],
		"no-unneeded-ternary": [
			"warn",
		],
		"no-process-exit": "off",
		"require-await": "error",
		"indent": [
			"error",
			"tab", 
			{
				"MemberExpression": 0
			}
		]
	}
};
