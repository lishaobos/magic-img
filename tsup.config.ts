import { defineConfig } from 'tsup'

export default defineConfig({
	entry: {
		index: './src/index.ts',
		vite: './src/vite.ts',
		webpack: './src/webpack.ts',
		react: './src/frameWork/react/index.tsx',
	},
	format: ['cjs', 'esm'],
	dts: true,
	target: 'es5',
	external: ['react']
})