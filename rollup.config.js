import json  from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'

export default {
	input: 'src/index.js',
	output: [
		{
			name: 'EventManager',
			format: 'umd',
			file: 'build/EventManager.js'
		},
		{
			format: 'es',
			file: 'build/EventManager.module.js'
		}
	],
	plugins: [ json(), babel() ]
}