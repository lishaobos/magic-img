import { defineConfig } from 'tsup'

export default defineConfig({
	entry: {
		index: './src/index.ts',
		vite: './src/vite.ts',
		webpack: './src/webpack.ts',
	},
	format: ['cjs', 'esm'],
	dts: true,
	target: 'es5'
})