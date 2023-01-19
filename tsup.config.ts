import { defineConfig } from 'tsup'

export default defineConfig({
	entry: {
		index: './src/index.ts',
		vite: './src/vite/index.ts',
	},
	format: ['cjs', 'esm'],
	dts: true
})