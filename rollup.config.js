import json  from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'

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
	plugins: [ json(), buble() ]
}